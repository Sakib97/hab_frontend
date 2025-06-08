import { Tag } from 'antd';

const ROLES = {
    'Sadmin': 1453,
    'Author': 1203,
    'Editor': 1260,
    'Sub Editor': 1444,
    'General User': 2024
};

const ROLE_COLORS = {
    'Sadmin': '#cd201f',
    'Author': '#E85C0F',
    'Editor': '#3b5999',
    'Sub Editor': '#87d068',
    'General User': 'gray'
};

export const getRoleBadges = (roleIDs) => {
    // Convert role ID to role name
    const roleNames = roleIDs.map(
        id => Object.keys(ROLES).find(role => ROLES[role] === id)
    ).filter(Boolean); // Filter out undefined if role not found

    // Return badge elements
    return roleNames.map(role => {
        const color = ROLE_COLORS[role] || 'gray';
        return (
            <Tag
                key={role}
                style={{
                    fontSize: '11px',
                    height: '19px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 'auto',
                    borderRadius: '20px',
                    fontWeight: 'bolder',
                    color: 'white',
                    backgroundColor: color,
                    marginRight: '10px',
                    padding: '1px 10px'
                }}
            >
                {role}
            </Tag>
        );
    });
};