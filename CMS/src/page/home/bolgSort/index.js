import React, { useEffect } from "react"
import { Form, Input, Button, Popconfirm, Badge } from "antd"
import { connect } from "react-redux";
import { changeVisible, removeBlogSort, getBlogSortList, changeRecord } from '../../../store/blogSort/actions'
import BaseTable from '../../../components/BsseTable'
import BlogSortForm from "./Form"
import { buttonItemLayout } from "../../utils"

function List(props) {

    const columns = [
        {
            title: '分类名称',
            dataIndex: 'sortName',
            key: 'sortName',
            render: text => <a>{text}</a>

        },
        {
            title: '点击数',
            dataIndex: 'clickCount',
            key: 'clickCount',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: (status) => status ? <Badge status="success" text="启动" /> : <Badge status="error" text="禁用" />
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

    let { setVisible, removeBlogByUid, findDataSource, setRecord } = props

    useEffect(() => {
        findDataSource()
    },[])

    const onFinish = values => findDataSource()

    const onReset = () => form.resetFields()

    const onAdd = () => setVisible({ visible: true, record: {} })

    const updateBlog = (record) => {
        setVisible({ visible: true })
        setRecord({ record })
    }
    const onDelByUid = uid => removeBlogByUid(uid)

    const onSizeChange = (page, pageSize) => findDataSource({ page, pageSize })

    return (
        <div>
            <BaseTable
                onSizeChange={onSizeChange}
                columns={columns}
                dataSource={dataSource}
                onAdd={onAdd}
            >
                <Form form={form} layout="inline" onFinish={onFinish}>
                    <Form.Item label="分类名称" name="blogName">
                        <Input placeholder="请输入博客名称" />
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
                <BlogSortForm />
            ) : null}
        </div>
    )
}

const mapStateToProps = ({ blogSort }) => ({
    visible: blogSort.visible,
    dataSource: blogSort.dataSource
})

const mapDispatchToProps = (dispatch) => {
    return {
        setVisible: (visible) => dispatch(changeVisible(visible)),
        removeBlogByUid: uid => dispatch(removeBlogSort(uid)),
        findDataSource: data => dispatch(getBlogSortList(data)),
        setRecord: record => dispatch(changeRecord(record))
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(List))