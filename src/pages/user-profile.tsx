import { Container } from '@/components/container';
import { useParams } from 'react-router-dom';

type UserProfileParams = {
  username: string;
}

export function UserProfile() {
  const { username } = useParams<UserProfileParams>();

  return (
    <Container>
      <div>
        <p>Profile from {username}</p>
      </div>
    </Container>
  );
}
