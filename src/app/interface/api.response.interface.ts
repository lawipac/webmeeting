
export interface ROtp {
  otp: string,
  status: "success" | "fail",
  emailed: boolean,
  //below is only available for debug stage
  debug: string,
  decode: {
    email: string,
    otp: number
  }
}

export interface SJwt{
  email: string;
  room: string;
  nick: string;
}
export interface RJwt{
  jwt: string;
}

export interface SSchedulemeeting{
  creator: string;
  room: string;
  start: number;
  public: number;
  guests: string[];
}
export interface RScheduleMeeting{
  start: number;
  end: number;
  room: string;
  creator: string;
  guests: string[];
  public: number;
  status: number;
  success: 'success'|'fail';
}

export interface SLogin{
  email: string;
  otp: string;
  nick: string;

}
export interface Rlogin{
  status: boolean;
  ts: number;
  match: boolean;
  expired: boolean;
  ttl: number;
  otp: string;
  auth: string;//token
}

export interface SQueryMeeting{
  query:  string; //creator| future | guest | my
  creator: string;
  ts: number;
  guest:  string;
}

export interface MeetingItem{
  ts: number;
  creator: string;
  guests: {
    email: string;
    name: string;
  }[];
  status: number;
  public: number;
  end: number;
  start: number;
  room: string;

  description:string;
}

export interface SQueryRecording{
  ts: number;

}

export interface Participant{
  name: string;
  id: string;
}
export interface Recording{
  fqn: string;
  sessionId: string;
  "data": {
    recordingSessionId: string;
    preAuthenticatedLink: string;
    share: boolean;
    initiatorId: string;
    durationSec: number,
    endTimestamp: 1673172689683;
    startTimestamp: 1673172630216;
    participants: Participant[];
  },
  timestamp: number;
  eventType: string;
  appId: string;
  idempotencyKey: string;
  customerId: string;
}

export interface meetingKey{
  room: string;
  start: number;
}
export interface RDeleteMeeting{
  status: boolean;
  input: meetingKey[];
}
