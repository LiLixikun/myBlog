import React from 'react'
import { Layout } from "antd"
const { Footer } = Layout;

export default function Index(props) {
    return (
        <Footer
            style={{ textAlign: 'center' }}
        >
            Ant Design ©2018 Created by Ant UED
        </Footer>
    )
}