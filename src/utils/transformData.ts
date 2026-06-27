interface RandomUserApiResult {
  login: { uuid: string };
  name: { first: string; last: string };
  picture: { large: string };
  email: string;
  location: { country: string };
  dob: { age: number };
}

interface TransformedData {
  id: string;
  name: string;
  part: string;
  picture: string;
  email: string;
  location: string;
  age: number;
  skills: string[];
  summary: string;
  isMe: boolean;
}

export const transformLionData = (apiResult: RandomUserApiResult): TransformedData => {
  const parts = ['Frontend', 'Backend', 'Design'];
  const randomPart = parts[Math.floor(Math.random() * parts.length)];

  return {
    id: apiResult.login.uuid,
    name: `${apiResult.name.first} ${apiResult.name.last}`,
    part: randomPart,
    picture: apiResult.picture.large,
    email: apiResult.email,
    location: apiResult.location.country,
    age: apiResult.dob.age,

    skills: ['열정', '노력'],
    summary: '반갑습니다! 새로 합류한 아기 사자입니다.',
    isMe: false
  };
};