import LaLigaIcon from "@/resources/leagues/laliga.png";
import SerieAIcon from "@/resources/leagues/seriea.png";
import EPLIcon from "@/resources/leagues/epl.png";
import BundesligaIcon from "@/resources/leagues/bundesliga.png";
import Ligue1Icon from "@/resources/leagues/ligue1.png";

import ArsenalIcon from "@/resources/teams/epl/arsenal.png";
import WestHamUnitedIcon from "@/resources/teams/epl/westham.png";
import SheffieldIcon from "@/resources/teams/epl/sheffield.png";
import AstonVillaIcon from "@/resources/teams/epl/astonvilla.png";
import BrentfordIcon from "@/resources/teams/epl/brentford.png";
import BrightonIcon from "@/resources/teams/epl/brighton.png";
import BurnleyIcon from "@/resources/teams/epl/burnley.png";
import FulhamIcon from "@/resources/teams/epl/fullham.png";
import ManCityIcon from "@/resources/teams/epl/mancity.png";
import ManUnitedIcon from "@/resources/teams/epl/manunited.png";
import WolvesIcon from "@/resources/teams/epl/wolverhampton.png";
import LiverpoolIcon from "@/resources/teams/epl/liverpool.png";
import EvertonIcon from "@/resources/teams/epl/everton.png";

import BarcelonaIcon from "@/resources/teams/laliga/barcelona.png";
import AtleticoMadridIcon from "@/resources/teams/laliga/atleticomadrid.png";
import RealMadridIcon from "@/resources/teams/laliga/realmadrid.png";

import LensIcon from "@/resources/teams/ligue1/lens.png";
import PSGIcon from "@/resources/teams/ligue1/psg.png";
import LyonIcon from "@/resources/teams/ligue1/lyon.png";
import MonacoIcon from "@/resources/teams/ligue1/monaco.png";

import AtalantaIcon from "@/resources/teams/seriea/atalanta.png";
import FiorentinaIcon from "@/resources/teams/seriea/fiorentina.png";
import InterMilanIcon from "@/resources/teams/seriea/inter.png";
import GenoaIcon from "@/resources/teams/seriea/genoa.png";
import JuventusIcon from "@/resources/teams/seriea/juventus.png";
import LazioIcon from "@/resources/teams/seriea/lazio.png";
import NapoliIcon from "@/resources/teams/seriea/napoli.png";

export const leagueIcons: { [key: string]: string } = {
  "LaLiga Santander": LaLigaIcon.src,
  "Serie A": SerieAIcon.src,
  "Premier League": EPLIcon.src,
  Bundesliga: BundesligaIcon.src,
  "Ligue 1": Ligue1Icon.src,
};

export const teamIcons: { [key: string]: string } = {
  // epl
  Arsenal: ArsenalIcon.src,
  "West Ham United": WestHamUnitedIcon.src,
  "Sheffield United": SheffieldIcon.src,
  "Aston Villa": AstonVillaIcon.src,
  Brentford: BrentfordIcon.src,
  "Brighton & Hove Albion": BrightonIcon.src,
  Burnley: BurnleyIcon.src,
  Fulham: FulhamIcon.src,
  "Manchester City": ManCityIcon.src,
  "Manchester United": ManUnitedIcon.src,
  Liverpool: LiverpoolIcon.src,
  "Wolverhampton Wanderers": WolvesIcon.src,
  Everton: EvertonIcon.src,

  // serie a
  Inter: InterMilanIcon.src,
  Genoa: GenoaIcon.src,
  Atalanta: AtalantaIcon.src,
  Fiorentina: FiorentinaIcon.src,
  Juventus: JuventusIcon.src,
  Lazi: LazioIcon.src,
  "SSC Napoli": NapoliIcon.src,

  // la liga
  Barcelona: BarcelonaIcon.src,
  "Atletico Madrid": AtleticoMadridIcon.src,
  "Real Madrid": RealMadridIcon.src,

  // ligue 1
  Lens: LensIcon.src,
  "Paris Saint Germain": PSGIcon.src,
  Lyon: LyonIcon.src,
  Monaco: MonacoIcon.src,

  // bundesliga
};