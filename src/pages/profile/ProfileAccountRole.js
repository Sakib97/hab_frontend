import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Badge } from "antd";
import { Tag } from "antd";
const ProfileAccountRole = () => {
    const ROLES = {
        'Sadmin': 1453,
        'Author': 1203,
        'Editor': 1260,
        'Sub Editor': 1444,
        'General User': 2024
    }

    const ROLE_COLORS = {
        'Sadmin': '#cd201f',
        'Author': 'gold',
        'Editor': '#3b5999',
        'SubEditor': '#87d068',
        'General User': 'gray'
    }

    const { auth } = useAuth()
    const [roleID, setRoleID] = useState(auth?.roles || [])
    const [roleName, setRoleName] = useState([])

    const roleNames = () => {
        const roles = roleID.map(id => Object.keys(ROLES).find(role => ROLES[role] === id));
        setRoleName(roles)
    }

    useEffect(() => {
        if (roleID.length > 0) {
            roleNames();
        }
    }, [roleID]);

    const getRoleBadge = (role) => {
        const color = ROLE_COLORS[role] || 'gray'; // Default color if role is not in ROLE_COLORS
        return (
            <Tag
                key={role}
                style={{borderRadius:'20px' ,fontWeight:'bolder' ,
                    color: "white" ,backgroundColor: color, 
                    marginRight: '10px', padding: '1px 10px' }}> 
                    {role} 
            </Tag>
        );
    };

    return (
        <div >
            <br />
            <div style={{display: "flex", justifyContent: "center"}}>
                {roleName.map(role => getRoleBadge(role))}
            </div>
        </div>

    );
}

export default ProfileAccountRole;