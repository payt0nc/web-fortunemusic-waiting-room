export interface Event {
    id: number;
    uniqueId: string;
    name: string;
    artistName: string;
    photoUrl: string;
    date: Date;
    sessions: Map<number, Session>;
}

export interface Session {
    id: number;
    name: string;
    sessionName: string;
    startTime: Date;
    endTime: Date;
    members: Map<string, Member>;
}

export interface Member {
    order: number;
    name: string;
    thumbnailUrl: string;
    ticketCode: string;
}

// API Response Types
export interface EventArray {
    evtId: number
    evtCode: string
    evtName: string
    evtIsOnline: boolean
    evtDisplayFrom: string
    evtDisplayTo: string
    evtSortNo: number
    evtPhotUrl: string
    evtPhotoUpdate: string
    evtWebUrl: string
    dateArray: DateArray[]
}

export interface DateArray {
    datePrefecture?: string
    datePlace: string
    dateDate: string
    dateDayOfWeek: string
    timeZoneArray: TimeZoneArray[]
}

export interface TimeZoneArray {
    tzId: number
    tzName: string
    tzStart: string
    tzEnd: string
    tzDisplay: string
    tzUpdate: string
    memberArray: MemberArray[]
    hideWaitingInfo: boolean
}

export interface MemberArray {
    mbName: string
    mbSortNo: number
    mbPhotoUrl: string
    mbPhotoUpdate: string
    shCode: string
    shName: string
    shUseMulti?: number
    showControlNo?: boolean
    ticketArray?: TicketArray[]
    isShowApp: boolean
    ticketNumberLimit: number
    showSerial: boolean
    nextLane?: string
    nicknameInputLimit?: number
    nicknameInputText?: string
    nicknameLabel?: string
}

export interface TicketArray {
    tkCode: string
    tkName: string
}

export interface WaitingRooms {
    message: string;
    waitingRooms: Map<number, WaitingRoom[]>;
}

export interface WaitingRoom {
    ticketCode: string;
    peopleCount: number;
    waitingTime: number;
}
