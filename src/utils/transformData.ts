import { Database } from '../types/database';
import { Lion } from '../types/lion';

type LionRow = Database['public']['Tables']['lions']['Row'];

export const transformLionData = (row: LionRow): Lion => {
  return {
    id: row.id,
    name: row.name,
    part: row.part,
    isMe: row.is_me, // DB의 is_me를 isMe로 변환
    summary: row.summary,
    skills: row.skills,
    intro: row.intro,
    email: row.email,
    phone: row.phone,
    website: row.website,
    message: row.message,
    organization: row.organization
  };
};