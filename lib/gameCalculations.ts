import {
  Countries,
  Power,
  RegionId,
  RegionStatus,
  PowerStats,
  Regions,
  Country,
} from '~/store/types';

/**
 * Un paese è controllato se:
 * influenza >= influenza avversario + stabilità
 */
export function computeCountryControl(country: Country): Power | undefined {
  if (country.blueInfluence >= country.redInfluence + country.stability) {
    return Power.USA;
  }

  if (country.redInfluence >= country.blueInfluence + country.stability) {
    return Power.URSS;
  }

  return undefined;
}

export function updateCountriesControl(countries: Countries): Countries {
  return countries.map((c) => ({
    ...c,
    controlledBy: computeCountryControl(c),
  }));
}

export function computeRegionStatus(regionId: RegionId, countries: Countries): RegionStatus {
  const regionCountries = countries.filter((c) => c.region === regionId && !c.subregion);
  const battlegrounds = regionCountries.filter((c) => c.battleground || c.tempBattleground);

  const stats: Record<Power, PowerStats> = {
    [Power.USA]: { countries: 0, battlegrounds: 0, nonBattlegrounds: 0 },
    [Power.URSS]: { countries: 0, battlegrounds: 0, nonBattlegrounds: 0 },
  };

  for (const c of regionCountries) {
    if (!c.controlledBy) continue;
    const p = c.controlledBy;
    stats[p].countries++;
    if (c.battleground || c.tempBattleground) stats[p].battlegrounds++;
    else stats[p].nonBattlegrounds++;
  }

  const usa = stats[Power.USA];
  const urss = stats[Power.URSS];
  const totalBG = battlegrounds.length;

  /* ========= PRESENZA ========= */
  const presence: Power[] = [];
  if (usa.countries > 0) presence.push(Power.USA);
  if (urss.countries > 0) presence.push(Power.URSS);

  /* ========= DOMINIO ========= */
  let domination: Power | null = null;
  if (
    usa.countries > urss.countries &&
    usa.battlegrounds > urss.battlegrounds &&
    usa.battlegrounds >= 1 &&
    usa.nonBattlegrounds >= 1
  ) {
    domination = Power.USA;
  } else if (
    urss.countries > usa.countries &&
    urss.battlegrounds > usa.battlegrounds &&
    urss.battlegrounds >= 1 &&
    urss.nonBattlegrounds >= 1
  ) {
    domination = Power.URSS;
  }

  /* ========= CONTROLLO ========= */
  let control: Power | null = null;
  if (usa.countries > urss.countries && usa.battlegrounds === totalBG && totalBG > 0)
    control = Power.USA;
  else if (urss.countries > usa.countries && urss.battlegrounds === totalBG && totalBG > 0)
    control = Power.URSS;

  return { presence, domination, control };
}

export function computeAllRegionsStatus(
  regions: Regions,
  countries: Countries
): Record<RegionId, RegionStatus> {
  const result = {} as Record<RegionId, RegionStatus>;

  (Object.keys(regions) as RegionId[]).forEach((regionId) => {
    result[regionId] = computeRegionStatus(regionId, countries);
  });

  return result;
}

export function computeRegionalBonusVP(
  regionId: RegionId,
  power: Power,
  countries: Countries
): number {
  const regionCountries = countries.filter((c) => c.region === regionId && !c.subregion);

  let vp = 0;

  for (const c of regionCountries) {
    if (c.controlledBy !== power) continue;

    // +1 PV per Stato Conteso controllato
    if (c.battleground || c.tempBattleground) {
      vp += 1;
    }

    // +1 PV se adiacente alla superpotenza nemica
    if (c.adjacentTo && c.adjacentTo !== power) {
      vp += 1;
    }
  }

  return vp;
}

export function computeRegionScore(
  regionId: RegionId,
  power: Power,
  regions: Regions,
  regionsStatus: Record<RegionId, RegionStatus>,
  countries: Countries
): number {
  const status = regionsStatus[regionId];
  const base = regions[regionId].points;

  let vp = 0;

  // Si applica la logica "highest-only"
  if (status.control === power) {
    // Check su CONTROLLO che ha priorità massima
    vp += base.control;
  } else if (status.domination === power) {
    // Se non c'è controllo, check su DOMINIO
    vp += base.domination;
  } else if (status.presence.includes(power)) {
    // Se non domina né controlla, solo PRESENZA
    vp += base.presence;
  }

  // Bonus aggiuntivi per paesi controllati (sempre aggiunti)
  vp += computeRegionalBonusVP(regionId, power, countries);

  return vp;
}

