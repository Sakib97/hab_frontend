import { useState } from 'react';
import { Avatar, List, Radio, Space } from 'antd';

const data = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
];

const ProfileNotification = () => {
    const [position, setPosition] = useState('bottom');
    const [align, setAlign] = useState('center');
    return (
        <div style={{
            width: "100%",
            padding: "20px",
            // backgroundColor: "gray"
        }}>
            <h1> Notifications </h1>
            <hr />
            <div style={{}}>
                <List
                    pagination={{
                        position,
                        align,
                    }}
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                title={<a href="https://ant.design">{item.title}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
            </div>
            {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore atque aspernatur necessitatibus dolor labore repudiandae molestiae ea, magni consequuntur voluptate, provident quas exercitationem eum quasi id quos dignissimos praesentium inventore aperiam vel perspiciatis sequi eius iusto! Eum quasi magnam illo odio fugit quo perferendis quos. Molestiae inventore odio, rem id similique ipsam, quo reprehenderit alias, laboriosam voluptates labore? Reprehenderit error esse voluptatum nesciunt veniam ex fugit vero sit animi. Consectetur ipsum tempore dolore magni, iure est. Dolore repellat minus ducimus enim repellendus quia amet ad id, consequatur tenetur quas animi, pariatur similique porro tempore cumque eos, iusto perspiciatis accusantium velit. */}
        </div>
    );
}

export default ProfileNotification;