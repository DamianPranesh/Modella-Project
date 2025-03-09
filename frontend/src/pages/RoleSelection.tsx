import { useAuth0 } from '@auth0/auth0-react';

const RoleSelection = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  const assignRole = async (role: 'model' | 'business') => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8000/api/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user?.sub,
          role: role
        })
      });
  
      if (response.ok) {
        // Redirect to onboarding or dashboard
        window.location.href = '/onboarding';
      }
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-2xl font-semibold mb-6">Choose Your Role</h2>
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => assignRole('model')}
          className="w-full px-4 py-3 bg-orange-500 text-white rounded-md"
        >
          I am a Model
        </button>
        <button
          onClick={() => assignRole('business')}
          className="w-full px-4 py-3 bg-orange-500 text-white rounded-md"
        >
          I am a Business
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;