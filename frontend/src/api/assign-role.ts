import { Request, Response } from 'express';
import { ManagementClient } from 'auth0';

interface RoleRequest extends Request {
  body: {
    role: string;
    userId: string;
  }
}

const auth0 = new ManagementClient({
  domain: process.env.VITE_AUTH0_DOMAIN!,
  clientId: process.env.VITE_AUTH0_CLIENT_ID!,
  clientSecret: process.env.VITE_AUTH0_CLIENT_SECRET!,
});

export default async function handler(
  req: RoleRequest,
  res: Response
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, userId } = req.body;

  try {
    // Update user metadata with role
    await auth0.users.update({ id: userId }, {
      role: role
    });

    // Assign role in Auth0
    await auth0.users.assignRoles({ id: userId }, {
      roles: [role]
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error assigning role:', error);
    return res.status(500).json({ error: 'Failed to assign role' });
  }
}