export const transformLionData = (apiResult) => {
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