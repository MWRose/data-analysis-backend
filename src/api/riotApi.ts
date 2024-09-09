import { updateDocuments } from "../data/mongo/riot";
import { ENVVARS } from "../util/envvars";

export interface RiotGameData {
    kills?: number;
    deaths?: number;
    assists?: number;
    champion?: string;
    win?: boolean;
    gameId?: string;
    totalMinionsKilled: number;
    laneMinionsFirst10Minutes: number;
    individualPosition: string;
}

const fetchRiotApi = async (url: string): Promise<JSON> => {
    console.log(url);
    return fetch(url, {
        method: 'GET',
        headers: {
            "X-Riot-Token": ENVVARS.RIOT_API_KEY ?? ""
        },
    })
    .then(response => response.json())
    .catch(err => console.error('riot api error', err));
};

export const getAccount = async (puuid: string): Promise<JSON> => {
    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`
    return fetchRiotApi(url);
};

export const getMatches = async (puuid: string, count?: number): Promise<JSON> => {
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=ranked&start=0&count=${count ?? 5}`
    return fetchRiotApi(url);
};

export const getMatch = async (matchId: string): Promise<JSON> => {
    const url = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`
    return fetchRiotApi(url);
};

export const getLastMatches = async (puuid: string, count?: number): Promise<JSON[]> => {
    const matches: string[] = await getMatches(puuid, count).then(data => JSON.parse(JSON.stringify(data)));
    const matchResults: Promise<JSON[]> = Promise.all(matches.map(match => getMatch(match)));
    return matchResults;
}

export const getRelevantMatchData = async (puuid: string, count?: number): Promise<RiotGameData[]> => {
    return getLastMatches(puuid, count).then((matches: any) => {
        return matches.map((match: any): RiotGameData => {
            return extractData(match, ENVVARS.RIOT_PUUID ?? "")
        });
    })
};

export const extractData = (match: any, puuid: string): RiotGameData => {

    match.personal = match?.info?.participants?.filter((p: any) => p?.puuid === puuid)?.[0]
    return {
        kills: match.personal?.kills,
        deaths: match.personal?.deaths,
        assists: match.personal?.assists,
        champion: match.personal?.championName,
        win: match.personal?.win,
        gameId: match.metadata?.matchId,
        totalMinionsKilled: match.personal?.totalMinionsKilled,
        laneMinionsFirst10Minutes: match.personal?.challenges?.laneMinionsFirst10Minutes,
        individualPosition: match.personal?.individualPosition,
    };
}

export const updateMatchData = async (puuid: string, count?: number) => {
    const lastMatches = await getRelevantMatchData(puuid, count);
    updateDocuments(lastMatches).then(() => console.log('success'));
}