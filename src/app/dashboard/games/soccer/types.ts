import LaLigaIcon from "@/resources/leagues/laliga.png";
import SerieAIcon from "@/resources/leagues/seriea.png";
import EPLIcon from "@/resources/leagues/epl.png";
import BundesligaIcon from "@/resources/leagues/bundesliga.png";
import Ligue1Icon from "@/resources/leagues/ligue1.png";

import ArsenalIcon from "@/resources/teams/epl/arsenal.png";
import WestHamUnitedIcon from "@/resources/teams/epl/westham.png";

import BarcelonaIcon from "@/resources/teams/laliga/barcelona.png";
import AtleticoMadridIcon from "@/resources/teams/laliga/atleticomadrid.png";
import RealMadridIcon from "@/resources/teams/laliga/realmadrid.png";

import LensIcon from "@/resources/teams/ligue1/lens.png";
import PSGIcon from "@/resources/teams/ligue1/psg.png";
import LyonIcon from "@/resources/teams/ligue1/lyon.png";

import AtalantaIcon from "@/resources/teams/seriea/atalanta.png";
import FiorentinaIcon from "@/resources/teams/seriea/fiorentina.png";
import InterMilanIcon from "@/resources/teams/seriea/inter.png";
import GenoaIcon from "@/resources/teams/seriea/genoa.png";
import JuventusIcon from "@/resources/teams/seriea/juventus.png";
import LazioIcon from "@/resources/teams/seriea/lazio.png";

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

  // serie a
  Inter: InterMilanIcon.src,
  Genoa: GenoaIcon.src,
  Atalanta: AtalantaIcon.src,
  Fiorentina: FiorentinaIcon.src,
  Juventus: JuventusIcon.src,
  Lazi: LazioIcon.src,

  // la liga
  Barcelona: BarcelonaIcon.src,
  "Atletico Madrid": AtleticoMadridIcon.src,
  "Real Madrid": RealMadridIcon.src,

  // ligue 1
  Lens: LensIcon.src,
  "Paris Saint Germain": PSGIcon.src,
  Lyon: LyonIcon.src,

  // bundesliga
};