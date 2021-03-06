import React, { useEffect } from "react"
import { connect } from "react-redux";
import { Layout, BackTop } from "antd"
import Header from "../components/Header"
import Content from "../components/Content"
import Footer from "../components/Footer"
import Sider from "../components/Sider"
import { findTagList } from "../store/tag/actions"
import { findAllSort } from "../store/blogSort/actions"
import "./index.less"

function App(props) {
    const { findTagAll, findBlogSortAll } = props

    useEffect(() => {
        findTagAll()
        findBlogSortAll()
    }, [])

    return (
        <div>
            <BackTop visibilityHeight={50}>
                <div className="ant-back-top-inner">UP</div>
            </BackTop>
            < Layout>
                <Sider location={props.location} />
                <Layout className="site-layout">
                    <Header />
                    <Content>
                        {props.children}
                    </Content>
                    <Footer />
                </Layout>
            </Layout >
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        findTagAll: () => dispatch(findTagList()),
        findBlogSortAll: () => dispatch(findAllSort()),
    }
}

export default connect(null, mapDispatchToProps)(App)