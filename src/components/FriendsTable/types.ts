export interface Friend {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
  lastActive: string;
  netResult: number;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
