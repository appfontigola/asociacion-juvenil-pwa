export type UserRole = 'admin' | 'user';

export type AttendanceStatus = 'going' | 'not_going' | 'undecided';

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  active: boolean;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location?: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventAttendance {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  status: AttendanceStatus;
  updatedAt: Date;
}

export interface LocalPresence {
  userId: string;
  userName: string;
  entryTime: Date;
  active: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface UpdateUserData {
  displayName?: string;
  role?: UserRole;
  active?: boolean;
  photoURL?: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AdminPanel: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  NoticesTab: undefined;
  CalendarTab: undefined;
  LocalTab: undefined;
  ProfileTab: undefined;
};

export type NoticesStackParamList = {
  NoticesList: undefined;
  NoticeDetail: { noticeId: string };
  CreateNotice: undefined;
  EditNotice: { noticeId: string };
};

export type CalendarStackParamList = {
  Calendar: undefined;
  EventDetail: { eventId: string };
  CreateEvent: undefined;
  EditEvent: { eventId: string };
};

export type AdminStackParamList = {
  AdminPanel: undefined;
  CreateUser: undefined;
  EditUser: { userId: string };
  AdminNotices: undefined;
  CreateNoticeAdmin: undefined;
  EditNoticeAdmin: { noticeId: string };
  AdminEvents: undefined;
  CreateEventAdmin: undefined;
  EditEventAdmin: { eventId: string };
  AttendanceOverview: undefined;
  Payments: undefined;
};
