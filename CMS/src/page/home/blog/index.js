import React, { useEffect } from "react"
import { Form, Input, Button, Popconfirm, Badge } from "antd"
import { connect } from "react-redux";
import { changeVisible, removeBlog, getBlogList, changeRecord } from '../../../store/blog/actions'
import BaseTable from '../../../components/BsseTable'
import BlogForm from "./Form"
import { buttonItemLayout } from "../../utils"

function List(props) {
    console.log(props);

    const columns = [
        {
            title: '博客标题',
            dataIndex: 'title',
            key: 'title',
            render: text => <a>{text}</a>
        },
        {
            title: '点击数',
            dataIndex: 'clickCount',
            key: 'clickCount',
        },
        {
            title: '收藏数',
            dataIndex: 'collectCount',
            key: 'collectCount'
        },
        {
            title: '博客分类',
            dataIndex: 'blogSortUid',
            key: 'blogSortUid'
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: (status) => status ? <Badge status="success" text="启动" /> : <Badge status="error" text="禁用" />
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author'
        },

        {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => updateBlog(record)}>修改</a>
                    <Popconfirm title="确定删除吗?" okText="确定" cancelText="取消" onConfirm={() => onDelByUid(record.uid)}>
                        <a style={{ color: '#a61d24', marginLeft: 16 }}>删除</a>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    const [form] = Form.useForm();
    const { dataSource, visible } = props

    let { setVisible, removeBlogByUid, findAll, setRecord } = props

    useEffect(() => {
        if (dataSource.length === 0) {
            findAll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = values => findAll()

    const onReset = () => form.resetFields()

    const onAdd = () => setVisible({ visible: true, record: {} })

    const updateBlog = (record) => {
        setVisible({ visible: true })
        setRecord({ record })
    }
    const onDelByUid = uid => removeBlogByUid(uid)
    console.log(columns);

    return (
        <div>
            <BaseTable
                columns={columns}
                dataSource={dataSource}
                onAdd={onAdd}
            >
                <Form form={form} layout="inline" onFinish={onFinish}>
                    <Form.Item label="博客标题" name="title">
                        <Input placeholder="请输入博客标题" />
                    </Form.Item>
                    <Form.Item label="状态" name="status">
                        <Input placeholder="请选择状态" />
                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </Form.Item>
                    <Form.Item {...buttonItemLayout}>
                        <Button type="danger" onClick={onReset}>重置</Button>
                    </Form.Item>
                </Form>
            </BaseTable>
            {visible ? (
                <BlogForm />
            ) : null}
        </div>
    )
}

const mapStateToProps = ({ blog }) => ({
    visible: blog.visible,
    dataSource: blog.dataSource
})

const mapDispatchToProps = (dispatch) => {
    return {
        setVisible: (visible) => dispatch(changeVisible(visible)),
        removeBlogByUid: uid => dispatch(removeBlog(uid)),
        findAll: () => dispatch(getBlogList()),
        setRecord: record => dispatch(changeRecord(record))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(List))