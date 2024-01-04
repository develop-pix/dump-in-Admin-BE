export interface PhotoBoothReqBodyProps {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  brandName: string;
  roadAddress: string;
  streetAddress: string;
  operationTime: string;
}

export interface ToBoothProps extends PhotoBoothReqBodyProps {}

export interface FindBoothOptionProps
  extends Pick<
    Partial<PhotoBoothReqBodyProps>,
    'location' | 'brandName' | 'name'
  > {}
