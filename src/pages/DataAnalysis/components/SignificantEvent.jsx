import { message, Table, Pagination, DatePicker, Select, Descriptions, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryByOfType, querySignificantEvent, queryExDividendsHeadline, queryEventContent } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { mimeType, subGroupArray, timeSpan } from '@/utils/utils';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
let dateFormat = 'YYYY-MM-DDTHH:mm:ss';
const SignificantEvent = (props) => {
    let pageTotal = '共';
    let pageItems = '条';
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    const [loadingState, setLoadingState] = useState(true);//loading
    const [eventData, setEventData] = useState([]);//重大事件所有数据
    const [eventPage, setEventPage] = useState([]);//分页数据
    const [infoState, setInfoState] = useState(false);//查看详情页

    //重大事件
    const columns = [
        {
            title: <FormattedMessage id="pages.significantEvent.releaseDate" defaultMessage="发布日期" />,
            dataIndex: 'LastUpdate',
            width: 150,
            sorter: {
                compare: (a, b) => {
                    let aTimeStr = a.Dates.LastUpdate;
                    let bTimeStr = b.Dates.LastUpdate;
                    let aTime = new Date(aTimeStr).getTime();
                    let bTime = new Date(bTimeStr).getTime();
                    return aTime - bTime;
                },
                multiple: 1,
            },
            render: (val, record) => {

                return <span>{record.Dates && record.Dates.LastUpdate ? moment(record.Dates.LastUpdate).format('YYYY-MM-DD') : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.significantEvent.documentTitle" defaultMessage="标题" />,
            dataIndex: 'Headline',
            render: (val, record) => {
                return <span>{record.Headline ? record.Headline : 'No Title'}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.significantEvent.theme" defaultMessage="主题" />,
            dataIndex: 'theme',
            render: (val, record) => {
                return <span>
                    {record.Topics ? Object.keys(record.Topics).map((t) => (
                        <span><span key={record.Topics[t].Code}>{record.Topics[t].Value}</span><br /></span>
                    )) : ''}
                </span>
            }
        },
    ];

    //股利数据
    const dividendsColumns = [
        {
            title: <FormattedMessage id="pages.significantEvent.releaseDate" defaultMessage="发布日期" />,
            dataIndex: 'LastUpdate',
            width: 150,
            sorter: {
                compare: (a, b) => {
                    let aTimeStr = a.LastUpdate;
                    let bTimeStr = b.LastUpdate;
                    let aTime = new Date(aTimeStr).getTime();
                    let bTime = new Date(bTimeStr).getTime();
                    return aTime - bTime;
                },
                multiple: 1,
            },
            render: (val, record) => {
                return <span>{record.LastUpdate ? moment(record.LastUpdate).format('YYYY-MM-DD') : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.significantEvent.documentTitle" defaultMessage="标题" />,
            dataIndex: 'Headline',
            render: (val, record) => {
                return <span className={styles.checkInfo} onClick={() => checkDividendsInfo(record)}>{record.Name ? record.Name : 'No Title'}</span>
            }
        },
    ];

    //查看股利详情
    const checkDividendsInfo = (item) => {
        if (item.EventId) {
            getDividendsInfo(item.EventId);
        }
        setInfoState(true)
    }

    //重大事件分类
    let params = {
        ofType: 'f108重大事件',
        accessToken: userInfo.accessToken
    }
    //股利数据详情
    let dividendsInfoParams = {
        eventId: '',
        accessToken: userInfo.accessToken
    }
    //重大事件列表 
    let eventParams = {
        ric: "",  //可以为空
        topics: [],  //股票的分类 跟公告接口传参一样。
        startTime: moment(timeSpan(7).startDate).format(dateFormat),
        endTime: moment(timeSpan(7).endDate).format(dateFormat),
        maxNumberOfItems: 100,
        accessToken: userInfo.accessToken
    }

    //股利参数
    let dividendsParams = {
        ric: "",  //可以为空
        startTime: moment(timeSpan(107).startDate).format(dateFormat),
        endTime: moment(timeSpan(107).endDate).format(dateFormat),
        accessToken: userInfo.accessToken,
        pageNumber: 1,
        recordsPerPage: 10
    }
    /** 国际化配置 */
    const intl = useIntl();

    const getRowClassName = (record, index) => {
        let className = '';
        className = index % 2 === 0 ? styles.oddBack : "";
        return className;
    }

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            if (keyType && keyType == 701) {
                setOneInfoTitle('重大事件');
                queryByOfTypeList();
            } else if (keyType && keyType == 702) {
                setOneInfoTitle('股利数据');
                queryExDividendsHeadlineLists(ric)
            }
        } else {
            if (keyType && keyType == 701) {
                setOneInfoTitle('Significant events');
                queryByOfTypeList();
            } else if (keyType && keyType == 702) {
                setOneInfoTitle('Dividend data');
                queryExDividendsHeadlineLists(ric)
            }
        }

    }, [ric, keyType]);

    const [typeState, setTypeState] = useState([])//分类

    //重大事件分类
    const queryByOfTypeList = () => {
        queryByOfType(params).then(
            res => {
                if (res.state) {
                    setTypeState(res.data ? res.data : [])
                    querySignificantEventLists(ric, res.data ? res.data[0].code : []);
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    //重大事件列表
    const querySignificantEventLists = (ric, t) => {
        if (t) {
            eventParams.topics = [];
            eventParams.topics.push(t);
        } else {
            eventParams.topics = type;
        }
        eventParams.ric = ric;
        querySignificantEvent(eventParams).then(
            res => {
                if (res.state) {
                    setLoadingState(false);
                    if (res.data) {
                        if (res.data.GetSignificantDevelopments_Response_1) {
                            if (res.data.GetSignificantDevelopments_Response_1.FindResponse) {
                                setEventData(res.data.GetSignificantDevelopments_Response_1.FindResponse.Development ? res.data.GetSignificantDevelopments_Response_1.FindResponse.Development : [])
                                setEventPage(subGroupArray(res.data.GetSignificantDevelopments_Response_1.FindResponse.Development ? res.data.GetSignificantDevelopments_Response_1.FindResponse.Development : [], 10)[0]);
                            }
                        }
                    }
                } else {
                    setLoadingState(false);
                    message.error(res.message);
                }
            }
        )
    }

    const [dividendsData, setDividendsData] = useState([]);//股利数据列表
    const [dividendsPage, setDividendsPage] = useState([]);//股利数据分页数据
    //股利数据列表
    const queryExDividendsHeadlineLists = (ric) => {
        dividendsParams.ric = ric;
        queryExDividendsHeadline(dividendsParams).then(
            res => {
                if (res.state) {
                    setLoadingState(false);
                    if (res.data) {
                        if (res.data.GetEventHeadlines_Response_1) {
                            setDividendsData(res.data.GetEventHeadlines_Response_1.EventHeadlines ? res.data.GetEventHeadlines_Response_1.EventHeadlines ? res.data.GetEventHeadlines_Response_1.EventHeadlines.Headline : [] : [])
                            setDividendsPage(res.data.GetEventHeadlines_Response_1.PaginationResult ? res.data.GetEventHeadlines_Response_1.PaginationResult : [])
                        }
                    }
                } else {
                    setLoadingState(false);
                    message.error(res.message);
                }
            }
        )
    }

    const [cutPage, setCutPage] = useState(1);

    const onChange = (page, pageSize) => {
        setCutPage(page);
        setEventPage(subGroupArray(eventData, pageSize)[page - 1]);
    }

    const onShowSizeChange = (current, size) => {
        setCutPage(current);
        setEventPage(subGroupArray(eventData, size)[current - 1]);
    }

    //设置时间值
    const setTimeData = (e) => {
        if (keyType == 701) {
            eventParams.startTime = moment(e[0]._d).format(dateFormat);
            eventParams.endTime = moment(e[1]._d).format(dateFormat);
            querySignificantEventLists(ric);
        } else if (keyType == 702) {
            dividendsParams.startTime = moment(e[0]._d).format(dateFormat);
            dividendsParams.endTime = moment(e[1]._d).format(dateFormat);
            queryExDividendsHeadlineLists(ric);
        }
    }

    const [type, setType] = useState([]);
    //设置分类
    const getEventList = (e) => {
        let typeArray = [];
        typeArray.push(e);
        setType(typeArray)
        querySignificantEventLists(ric, e);
    }

    //返回
    const changeState = () => {
        setInfoState(false)
    }

    const [eventInfo, setEventInfo] = useState({});  //股利数据详情
    //获取股利数据详情
    const getDividendsInfo = (id) => {
        dividendsInfoParams.eventId = id;
        queryEventContent(dividendsInfoParams).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        if (res.data.GetEvent_Response_1) {
                            setEventInfo(res.data.GetEvent_Response_1.Event ? res.data.GetEvent_Response_1.Event : {})
                        }
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                {infoState ? <LeftOutlined className={styles.leftReback} onClick={changeState} /> : ''}<span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            {
                !infoState ?
                    <div>
                        <div className={styles.timeRange}>
                            <FormattedMessage id="pages.tradingValuation.timeRange" defaultMessage="时间范围:" />
                            <RangePicker name='timeRange'
                                className={styles.timeContentLeft}
                                defaultValue={[moment(timeSpan(7).startDate, dateFormat), moment(timeSpan(7).endDate, dateFormat)]}
                                onChange={(e) => setTimeData(e)} />
                            {keyType == 701 ?
                                <span style={{ marginLeft: '32px' }}>
                                    <FormattedMessage id="pages.significantEvent.classification" defaultMessage="分类:" />
                                    <Select
                                        showSearch
                                        style={{ width: 200, marginLeft: '24px' }}
                                        placeholder={intl.formatMessage({
                                            id: 'pages.significantEvent.classification.placeholder',
                                            defaultMessage: '请选择分类',
                                        })}
                                        onSelect={getEventList}
                                    >
                                        {typeState.length > 0 ? typeState.map((item) => (
                                            <Option key={item.id} value={item.code}>{intl.locale === "zh-CN" ? item.classNameZh : item.classNameEh}</Option>
                                        )) : ''
                                        }
                                    </Select>
                                </span> : ''}
                        </div>
                        {keyType == 701 ?
                            <div>
                                <Table loading={loadingState}
                                    scroll={{ x: '100%' }}
                                    rowKey={(record) => record.Xrefs ? record.Xrefs.DevelopmentId ? record.Xrefs.DevelopmentId : '' : ""}
                                    columns={columns}
                                    rowClassName={getRowClassName}
                                    dataSource={eventPage}
                                    pagination={false} />
                                <div className={styles.pageBox}>
                                    <Pagination
                                        total={eventData.length}
                                        showTotal={(total) => `${pageTotal} ${eventPage.length} ${pageItems} `}
                                        defaultPageSize={10}
                                        current={cutPage ? cutPage : 1}
                                        onChange={onChange}
                                        onShowSizeChange={onShowSizeChange}
                                    />
                                </div>
                            </div> :
                            keyType == 702 ?
                                <div>
                                    <Table loading={loadingState}
                                        scroll={{ x: '100%' }}
                                        rowKey={(record) => record.EventId}
                                        columns={dividendsColumns}
                                        rowClassName={getRowClassName}
                                        dataSource={dividendsData}
                                        pagination={false} />
                                    <div className={styles.pageBox}>
                                        <Pagination
                                            total={dividendsPage ? dividendsPage.TotalRecords : 0}
                                            showTotal={(total) => `${pageTotal} ${dividendsPage ? dividendsPage.TotalRecords : 0} ${pageItems} `}
                                            defaultPageSize={10}
                                            current={cutPage ? cutPage : 1}
                                            onChange={onChange}
                                            onShowSizeChange={onShowSizeChange}
                                        />
                                    </div>
                                </div> : ''}

                    </div> :
                    eventInfo.Dividend ? <div className={styles.descBox}>
                        <Descriptions column={1}>
                            <Descriptions.Item
                                label={intl.formatMessage({
                                    id: 'pages.significantEvent.announcement',
                                    defaultMessage: '公告日',
                                })}>
                                {eventInfo.Dividend ? eventInfo.Dividend.AnnouncementDate ? moment(eventInfo.Dividend.AnnouncementDate).format('YYYY-MM-DD') : '' : ''}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={intl.formatMessage({
                                    id: 'pages.significantEvent.PaymentType',
                                    defaultMessage: '支付类型',
                                })}>
                                {eventInfo.Dividend ? eventInfo.Dividend.PaymentType ? eventInfo.Dividend.PaymentType : '' : ''}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={intl.formatMessage({
                                    id: 'pages.significantEvent.currency',
                                    defaultMessage: '货币',
                                })}>
                                {eventInfo.Dividend ? eventInfo.Dividend.Currency ? eventInfo.Dividend.Currency : '' : ''}
                            </Descriptions.Item>
                        </Descriptions>
                    </div> : <Spin className={styles.spinLoading} />}
        </div>
    )
};

export default SignificantEvent;
