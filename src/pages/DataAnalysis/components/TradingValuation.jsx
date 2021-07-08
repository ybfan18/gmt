import { message, Table, Pagination, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { querySharePrice } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { subGroupArray, timeSpan } from '@/utils/utils';
import moment from 'moment';

const { RangePicker } = DatePicker;
let dateFormat = 'YYYY-MM-DDTHH:mm:ss';
const TradingValuation = (props) => {
    let pageTotal = '共';
    let pageItems = '条';
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    const [loadingState, setLoadingState] = useState(true);//loading
    const [sharePriceData, setSharePriceData] = useState({});//所有数据
    const [sharePricePage, setSharePricePage] = useState([]);//分页数据

    const columns = [
        {
            title: <FormattedMessage id="pages.tradingValuation.transactionDate" defaultMessage="交易日期" />,
            dataIndex: 'TIMESTAMP',
            render: (val, record) => {
                return <span>{record.TIMESTAMP ? moment(record.TIMESTAMP).format('YYYY-MM-DD') : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.tradingValuation.lowestPrice" defaultMessage="最低价" />,
            dataIndex: 'LOW',
            render: (val, record) => {
                return <span>{record.LOW ? record.LOW : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.tradingValuation.closingPrice" defaultMessage="收盘价" />,
            dataIndex: 'CLOSE',
            render: (val, record) => {
                return <span>{record.CLOSE ? record.CLOSE : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.tradingValuation.volume" defaultMessage="成交量(股)" />,
            dataIndex: 'VOLUME',
            render: (val, record) => {
                return <span>{record.VOLUME ? record.VOLUME : ''}</span>
            }
        },
    ];

    //默认ric
    let params = {
        ric: '',
        startTime: moment(timeSpan(7).startDate).format(dateFormat),
        endTime: moment(timeSpan(7).endDate).format(dateFormat),
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
            pageTotal = '共';
            pageItems = '条';
            if (keyType && keyType == 501) {
                setOneInfoTitle('每日行情');
            } else if (keyType && keyType == 502) {
                setOneInfoTitle('估值分析');
            }
        } else {
            pageTotal = 'Total';
            pageItems = 'items';
            if (keyType && keyType == 501) {
                setOneInfoTitle('The daily market');
            } else if (keyType && keyType == 502) {
                setOneInfoTitle('Valuation analysis');
            }
        }
        querySharePriceLists(ric);

    }, [ric]);

    //查询公告列表
    const querySharePriceLists = (ric) => {
        params.ric = ric;
        querySharePrice(params).then(
            res => {
                if (res.state) {
                    setLoadingState(false);
                    if (res.data) {
                        setSharePriceData(res.data.GetInterdayTimeSeries_Response_5 ? res.data.GetInterdayTimeSeries_Response_5 : []);
                        setSharePricePage(res.data.GetInterdayTimeSeries_Response_5 ? res.data.GetInterdayTimeSeries_Response_5 ? subGroupArray(res.data.GetInterdayTimeSeries_Response_5.Row ? res.data.GetInterdayTimeSeries_Response_5.Row : [], 20)[0] : [] : []);
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
        setSharePricePage(subGroupArray(sharePriceData ? sharePriceData.Row : [], pageSize)[page - 1]);
    }

    const onShowSizeChange = (current, size) => {
        setCutPage(current);
        setSharePricePage(subGroupArray(sharePriceData ? sharePriceData.Row : [], size)[current - 1]);
    }

    //设置时间值
    const setTimeData = (e) => {
        params.startTime = moment(e[0]._d).format(dateFormat);
        params.endTime = moment(e[1]._d).format(dateFormat);
        querySharePriceLists(ric);
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            <div>
                <div className={styles.timeRange}>
                    <FormattedMessage id="pages.tradingValuation.timeRange" defaultMessage="时间范围:" />
                    <RangePicker name='timeRange'
                        className={styles.timeContentLeft}
                        defaultValue={[moment(timeSpan(7).startDate, dateFormat), moment(timeSpan(7).endDate, dateFormat)]}
                        onChange={(e) => setTimeData(e)} />
                </div>
                <Table loading={loadingState}
                    scroll={{ x: '100%' }}
                    rowKey={(index, record) => index}
                    columns={columns}
                    rowClassName={getRowClassName}
                    dataSource={sharePricePage}
                    pagination={false} />
                <div className={styles.pageBox}>
                    <Pagination
                        total={sharePriceData.Row ? sharePriceData.Row.length : 0}
                        showTotal={(total) => `${pageTotal} ${sharePriceData.Row ? sharePriceData.Row.length : 0} ${pageItems} `}
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

export default TradingValuation;
