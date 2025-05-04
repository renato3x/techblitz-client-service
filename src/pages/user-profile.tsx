import { useParams } from 'react-router-dom';

type UserProfileParams = {
  username: string;
}

export function UserProfile() {
  const { username } = useParams<UserProfileParams>();

  return (
    <div>
      Profile from {username}
    </div>
  );
}
