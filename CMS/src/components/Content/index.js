import React from 'react'
import { Layout } from "antd"
import { Switch } from "react-router-dom"
import { renderRoutes } from 'react-router-config'
const { Content } = Layout;

export default function Index(props) {
    return (
        <Content style={{ margin: '0 16px', overflow: 'initial' }}>
            <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
                <Switch>
                    {renderRoutes(props.route.routes)}
                </Switch>
            </div>
        </Content>
    )
}