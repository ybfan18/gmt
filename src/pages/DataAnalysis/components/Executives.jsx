import { message, Table, Input, Tree, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { RightCircleOutlined, DownCircleOutlined } from '@ant-design/icons';

const Executives = (props) => {

    //董事会成员信息
    const { allData } = props;
    const userInfo = getAuthority();//获取用户相关信息
    /** 国际化配置 */
    const intl = useIntl();

    const [rowKeys, setRowKeys] = useState([]);

    useEffect(() => {
    }, [allData])

    //展开
    const open = (record) => {
        let key = record.key;
        if (rowKeys[0] !== key) {
            let keys = [];
            keys.push(key);
            setRowKeys(keys)
        } else {
            setRowKeys([])
        }
    }

    const columns = [
        {
            title: <FormattedMessage id="pages.Executives.name" defaultMessage="姓名" />,
            dataIndex: 'name',
            render: (val, record) => {
                return <span>{record.NameAndTitle.PersonalInfo.Info[1].Value} &nbsp; {record.NameAndTitle.PersonalInfo.Info[0].Value}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.Executives.jobTitle" defaultMessage="职务" />,
            dataIndex: 'jobTitle',
            render: (val, record) => {
                return <span>
                    {record.NameAndTitle.Titles.Designation ? record.NameAndTitle.Titles.Designation.map((item,index) => (
                        <span key={index}>
                            <span>{item.LongTitle}</span>
                            <br />
                        </span>
                    )) : ''
                    }
                </span>
            }
        },
        {
            title: <FormattedMessage id="pages.Executives.officeDate" defaultMessage="任职日期" />,
            dataIndex: 'officeDate',
            render: (val, record) => {
                if (record.NameAndTitle.TenureDates.DirectorStart) {
                    return <span>{record.NameAndTitle.TenureDates.DirectorStart.Year}{record.NameAndTitle.TenureDates.DirectorStart.Month ? '-' + record.NameAndTitle.TenureDates.DirectorStart.Month : ''}{record.NameAndTitle.TenureDates.DirectorStart.Day ? '-' + record.NameAndTitle.TenureDates.DirectorStart.Day : ''}</span>
                }
            }
        },
        {
            title: <FormattedMessage id="pages.Executives.gender" defaultMessage="性别" />,
            dataIndex: 'gender',
            render: (val, record) => {
                return <span>{record.NameAndTitle.PersonalInfo.Info[7].Value}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.Executives.DateOfBirth" defaultMessage="出生年份" />,
            dataIndex: 'DateOfBirth',
            render: (val, record) => {
                return <span>{record.NameAndTitle.PersonalInfo.Info[6].Value ? new Date().getFullYear() - parseInt(record.NameAndTitle.PersonalInfo.Info[6].Value) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.Executives.introduction" defaultMessage="简介" />,
            dataIndex: 'introduction',
            render: (record) => rowKeys.length > 0 ? <DownCircleOutlined onClick={() => open(record)} /> : <RightCircleOutlined onClick={() => open(record)} />,
        },
    ];

    return (
        <div className={styles.descBox}>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender: record => <p style={{ margin: 20 }}>{record.TenureDates}</p>,
                    expandedRowKeys: rowKeys
                }}
                rowKey={(record) => record.ID}
                dataSource={allData ? allData.GetGeneralInformation_Response_1 ? allData.GetGeneralInformation_Response_1.GeneralInformation.OfficersInfo.Officer : [] : []}
                pagination={false}
                rowClassName={
                    (record, index) =>
                        index % 2 === 0 ? styles.listEven : ''
                }
            />
        </div>
    )
};

export default Executives;
