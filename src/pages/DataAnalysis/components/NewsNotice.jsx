import { message, Table, Pagination } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryNoticeByRic, downloadkNotice } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { fileSizeTransform, mimeType } from '@/utils/utils';
import moment from 'moment';

const NewsNotice = (props) => {
    let pageTotal = '共';
    let pageItems = '条';
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('新闻公告&研究报告');//一级名称
    const [loadingState, setLoadingState] = useState(true);//loading
    const [newsNoticeData, setNewsNoticeData] = useState({});//所有数据
    const [newsNoticePage, setNewsNoticePage] = useState([]);//分页数据

    const columns = [
        {
            title: <FormattedMessage id="pages.companyNotice.noticeDate" defaultMessage="公告日期" />,
            dataIndex: 'arriveDate',
            sorter: {
                compare: (a, b) => {
                    let aTimeStr = a.submissionInfo[0].arriveDate;
                    let bTimeStr = b.submissionInfo[0].arriveDate;
                    let aTime = new Date(aTimeStr).getTime();
                    let bTime = new Date(bTimeStr).getTime();
                    return aTime - bTime;
                },
                multiple: 1,
            },
            render: (val, record) => {
                return <span>{moment(record.submissionInfo[0].arriveDatenew).format('YYYY-MM-DD')}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.companyNotice.documentTitle" defaultMessage="标题" />,
            dataIndex: 'documentTitle',
            width: 300,
            render: (val, record) => {
                return <span className={styles.checkInfo} onClick={() => getNoticeFile(record, 'view')}>{record.submissionInfo[0].documentTitle ? record.submissionInfo[0].documentTitle : 'No Title'}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.companyNotice.releaseDate" defaultMessage="发布时间" />,
            dataIndex: 'releaseDate',
            sorter: {
                compare: (a, b) => {
                    let aTimeString = a.submissionInfo[0].releaseDate;
                    let bTimeString = b.submissionInfo[0].releaseDate;
                    let aTime = new Date(aTimeString).getTime();
                    let bTime = new Date(bTimeString).getTime();
                    return aTime - bTime;
                },
                multiple: 2,
            },
            render: (val, record) => {
                return <span>{moment(record.submissionInfo[0].releaseDate).format("HH:mm")}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.companyNotice.fileSize" defaultMessage="大小" />,
            dataIndex: 'size',
            render: (val, record) => {
                return <span>{fileSizeTransform(record.submissionInfo[0].size)}</span>
            }
        },
    ];

    //默认ric
    let params = {
        ric: '',
        accessToken: userInfo.accessToken
    }
    //资产负债表、损益表、现金流量预测数据    
    let noticeParams = {
        ric: "",  //可以为空
        stockTypes: [],  //股票的分类 跟公告接口传参一样。
        pageSize: 20,      //不能为空
        currentPage: 1,   //不能为空
        language: "ZH",    //不能为空
        accessToken: userInfo.accessToken
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
            noticeParams.language = 'ZH';
            pageTotal = '共';
            pageItems = '条';
            if (keyType && keyType == 2) {
                setOneInfoTitle('新闻公告&研究报告');
            }
        } else {
            noticeParams.language = 'EN';
            pageTotal = 'Total';
            pageItems = 'items';
            if (keyType && keyType == 2) {
                setOneInfoTitle('Press Announcements & Research Reports');
            }
        }
        queryNewsNoticeLists(ric);

    }, [ric]);

    //查询公告列表
    const queryNewsNoticeLists = (ric) => {
        noticeParams.ric = ric;
        queryNoticeByRic(noticeParams).then(
            res => {
                if (res.state) {
                    setLoadingState(false);
                    if (res.data) {
                        setNewsNoticeData(res.data.SearchSubmissions_Response_1 ? res.data.SearchSubmissions_Response_1 : []);
                        setNewsNoticePage(res.data.SearchSubmissions_Response_1 ? res.data.SearchSubmissions_Response_1 ? res.data.SearchSubmissions_Response_1.submissionStatusAndInfo : [] : []);
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
        noticeParams.pageSize = pageSize ? pageSize : 20;
        noticeParams.currentPage = page ? page : 1;
        setCutPage(page);
        queryNewsNoticeLists();
    }

    const onShowSizeChange = (current, size) => {
        noticeParams.pageSize = size ? size : 20;
        noticeParams.currentPage = current ? current : 1;
        setCutPage(current);
        queryNewsNoticeLists();
    }

    //文件下载参数
    let fileParams = {
        fileType: '',
        dcn: '',
        originalFileName: '',
        size: '',
        accessToken: userInfo.accessToken
    }
    const getNoticeFile = (item, type) => {
        setLoadingState(true);
        let { fileType, DCN, originalFileName, size } = item.submissionInfo[0];
        fileParams.fileType = fileType;
        fileParams.dcn = DCN;
        fileParams.originalFileName = DCN;
        fileParams.size = size;
        downloadkNotice(fileParams).then(
            res => {
                setLoadingState(false);
                let documentType = mimeType(fileType);
                let blob = new Blob([res], { type: documentType + ';chartset=UTF-8' });
                const blobUrl = window.URL.createObjectURL(blob);
                if (type === 'down') {
                    const aElement = document.createElement("a");
                    const filename = originalFileName ? originalFileName : DCN; // 设置文件名称
                    aElement.href = blobUrl; // 设置a标签路径
                    aElement.download = filename;
                    aElement.click();
                    window.URL.revokeObjectURL(blobUrl);
                } else {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.target = "_blank";
                    link.click();
                }

            }
        )
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            <div>
                <Table loading={loadingState}
                    scroll={{ x: '100%' }}
                    rowKey={(record) => record.commonID}
                    columns={columns}
                    rowClassName={getRowClassName}
                    dataSource={newsNoticePage}
                    pagination={false} />
                <div className={styles.pageBox}>
                    <Pagination
                        total={newsNoticeData.totalHit}
                        showTotal={(total) => `${pageTotal} ${newsNoticeData.totalHit ? newsNoticeData.totalHit : 0} ${pageItems} `}
                        defaultPageSize={20}
                        current={cutPage ? cutPage : 1}
                        onChange={onChange}
                        onShowSizeChange={onShowSizeChange}
                    />
                </div>
            </div>
        </div>
    )
};

export default NewsNotice;
