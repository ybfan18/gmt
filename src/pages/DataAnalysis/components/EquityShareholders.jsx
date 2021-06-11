import React, { useState, useEffect } from 'react';
import { Pagination, message, Table, Spin, Tree, Modal } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import { queryShareholderInfo } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { numberFixed } from '@/utils/utils';
import moment from 'moment';
import {
    Chart,
    Axis,
    Tooltip,
    Geom,
    Coord,
} from "bizcharts";
import DataSet from "@antv/data-set";

const EquityShareholders = (props) => {

    //ric信息 ，选择类型
    const { ric, keyType } = props;
    const userInfo = getAuthority();//获取用户相关信息
    /** 国际化配置 */
    const intl = useIntl();

    //股东报告
    const columnsConsolidated = [
        {
            title: <FormattedMessage id="pages.equityShareholders.investorName" defaultMessage="投资者名称" />,
            dataIndex: 'investorName',
            fixed: 'left',
            render: (val, record) => {
                return <span>{record.Name ? record.Name : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.accountsOutstandingShares" defaultMessage="占发行在外股%" />,
            dataIndex: 'accountsOutstandingShares',
            render: (val, record) => {
                return <span>{record.Holding ? record.Holding.PctOfSharesOutstanding : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.holdShare" defaultMessage="持有股票($百万)" />,
            dataIndex: 'holdShare',
            render: (val, record) => {
                return <span>{record.Holding ? numberFixed(record.Holding.SharesHeld, 6, 2) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.changeShare" defaultMessage="持有股份变动($百万)" />,
            dataIndex: 'changeShare',
            render: (val, record) => {
                return <span className={record.Holding ? record.Holding.SharesHeldChange < 0 ? styles.shareRed : styles.shareGreen : ''}>{record.Holding ? numberFixed(record.Holding.SharesHeldChange, 6, 2) > 0 ? '+' + numberFixed(record.Holding.SharesHeldChange, 6, 2) : numberFixed(record.Holding.SharesHeldChange, 6, 2) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.holdValue" defaultMessage="持有价值($百万)" />,
            dataIndex: 'holdValue',
            render: (val, record) => {
                return <span>{record.Holding ? numberFixed(record.Holding.SharesHeldValue, 6, 2) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.declarationDate" defaultMessage="申报日期" />,
            dataIndex: 'declarationDate',
            render: (val, record) => {
                return <span>{record.Holding ? moment(record.Holding.HoldingsDate).format('YYYY-MM-DD') : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.declarationSource" defaultMessage="申报来源" />,
            dataIndex: 'declarationSource',
            render: (val, record) => {
                return <span>{record.Holding ? record.Holding.FilingType : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.investorType" defaultMessage="投资者类型" />,
            dataIndex: 'investorType',
            render: (val, record) => {
                return <span>{record.InvestorParentType ? record.InvestorParentType : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.investorSubtypes" defaultMessage="投资者子类型" />,
            dataIndex: 'investorSubtypes',
            render: (val, record) => {
                return <span>{record.InvestorType ? record.InvestorType : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.equityAssets" defaultMessage="权益资产($百万)" />,
            dataIndex: 'equityAssets',
            render: (val, record) => {
                return <span>{record.TotalEquityAssets ? numberFixed(record.TotalEquityAssets, 6, 2) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.investmentStyle" defaultMessage="投资风格" />,
            dataIndex: 'investmentStyle',
            render: (val, record) => {
                return <span>{record.InvestmentStyle ? record.InvestmentStyle : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.turnover" defaultMessage="成交额" />,
            dataIndex: 'turnover',
            render: (val, record) => {
                return <span>{record.TurnoverRating ? record.TurnoverRating : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.city" defaultMessage="城市" />,
            dataIndex: 'city',
            render: (val, record) => {
                return <span>{record.InvestorLocation ? record.InvestorLocation.City : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.economicCalenda.countriesRegion" defaultMessage="国家/地区" />,
            dataIndex: 'countriesRegion',
            render: (val, record) => {
                return <span>{record.InvestorLocation ? record.InvestorLocation.Country : ''}</span>
            }
        },
    ];

    //基金持仓
    const columnsFund = [
        {
            title: <FormattedMessage id="pages.equityShareholders.investorName" defaultMessage="投资者名称" />,
            dataIndex: 'investorName',
            fixed: 'left',
            render: (val, record) => {
                return <span>{record.Name ? record.Name : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.holdValue" defaultMessage="持有价值($百万)" />,
            dataIndex: 'holdValue',
            render: (val, record) => {
                return <span>{record.Holding ? numberFixed(record.Holding.SharesHeldValChg, 6, 2) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.tradableShares" defaultMessage="流通股(%)" />,
            dataIndex: 'tradableShares',
            render: (val, record) => {
                return <span>{record.Holding ? record.Holding.PctOfSharesOutstanding : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.positions" defaultMessage="头寸($百万)" />,
            dataIndex: 'positions',
            render: (val, record) => {
                return <span>{record.Holding ? numberFixed(record.Holding.SharesHeld, 6, 2) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.positionsChange" defaultMessage="头寸变动($百万)" />,
            dataIndex: 'positionsChange',
            render: (val, record) => {
                return <span className={record.Holding ? record.Holding.SharesHeldChange < 0 ? styles.shareRed : styles.shareGreen : ''}>{record.Holding ? numberFixed(record.Holding.SharesHeldChange, 6, 2) > 0 ? '+' + numberFixed(record.Holding.SharesHeldChange, 6, 2) : numberFixed(record.Holding.SharesHeldChange, 6, 2) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.latestFilingDate" defaultMessage="最新申报日期" />,
            dataIndex: 'latestFilingDate',
            render: (val, record) => {
                return <span>{record.Holding ? moment(record.Holding.HoldingsDate).format('YYYY-MM-DD') : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.buy" defaultMessage="买入($百万)" />,
            dataIndex: 'buy',
            render: (val, record) => {
                return <span></span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.sell" defaultMessage="卖出($百万)" />,
            dataIndex: 'sell',
            render: (val, record) => {
                return <span></span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.equityChanges" defaultMessage="股份变动($百万)" />,
            dataIndex: 'equityChanges',
            render: (val, record) => {
                return <span className={record.Holding ? record.Holding.SharesHeldChange < 0 ? styles.shareRed : styles.shareGreen : ''}>{record.Holding ? numberFixed(record.Holding.SharesHeldChange, 6, 2) > 0 ? '+' + numberFixed(record.Holding.SharesHeldChange, 6, 2) : numberFixed(record.Holding.SharesHeldChange, 6, 2) : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.investorType" defaultMessage="投资者类型" />,
            dataIndex: 'investorType',
            render: (val, record) => {
                return <span>{record.InvestorParentType ? record.InvestorParentType : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.investmentStyle" defaultMessage="投资风格" />,
            dataIndex: 'investmentStyle',
            render: (val, record) => {
                return <span>{record.InvestmentStyle ? record.InvestmentStyle : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.turnover" defaultMessage="成交额" />,
            dataIndex: 'turnover',
            render: (val, record) => {
                return <span>{record.TurnoverRating ? record.TurnoverRating : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.equityShareholders.city" defaultMessage="城市" />,
            dataIndex: 'city',
            render: (val, record) => {
                return <span>{record.InvestorLocation ? record.InvestorLocation.City : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.economicCalenda.countriesRegion" defaultMessage="国家/地区" />,
            dataIndex: 'countriesRegion',
            render: (val, record) => {
                return <span>{record.InvestorLocation ? record.InvestorLocation.Country : ''}</span>
            }
        },
    ];

    const [loadingPageState, setLoadingPageState] = useState(true);//list loading
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    const [twoInfoTitle, setTwoInfoTitle] = useState('');//二级名称

    let pageTotal = '共';
    let pageItems = '条';

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            pageTotal = '共';
            pageItems = '条';
            if (keyType && keyType == 301) {
                setOneInfoTitle('主要股东');
                setTwoInfoTitle('股东报告');
            } else if (keyType && keyType == 302) {
                setOneInfoTitle('主要基金');
                setTwoInfoTitle('基金持仓');
            }
        } else {
            pageTotal = 'Total';
            pageItems = 'items';
            if (keyType && keyType == 301) {
                setOneInfoTitle('Major shareholders');
                setTwoInfoTitle('Shareholder report');
            } else if (keyType && keyType == 302) {
                setOneInfoTitle('The main fund');
                setTwoInfoTitle('Fund positions');
            }
        }
        getShareholderInfo();
    }, [ric, keyType])

    //f10-4查询股本股东
    let shareParams = {
        ric: '',
        page: 1,
        pageSize: 20,
        type: '',
        accessToken: userInfo.accessToken
    }

    const [share, setShare] = useState({});
    const [pageList, setPageList] = useState([]);
    const [barData, setBarData] = useState([]);//条形图数据
    //模糊查询rici集合
    const getShareholderInfo = () => {
        if (keyType) {
            if (keyType == 301) {//股东报告
                shareParams.type = 'Consolidated';
            } else if (keyType == 302) {//基金持仓
                shareParams.type = 'Fund';
            }
        } else {
            return false;
        }
        setLoadingPageState(true);
        setBarData([]);
        queryShareholderInfo(shareParams).then(
            res => {
                if (res.state) {
                    setLoadingPageState(false);
                    if (res.data) {
                        setShare(res.data.GetShareholdersReport_Response_1 ? res.data.GetShareholdersReport_Response_1.SymbolReport : []);
                        setPageList(res.data.GetShareholdersReport_Response_1 ? res.data.GetShareholdersReport_Response_1.SymbolReport.Shareholders.Investor : []);

                        if (res.data.GetShareholdersReport_Response_1) {
                            if (res.data.GetShareholdersReport_Response_1.SymbolReport.Shareholders.Investor) {
                                let datas = [];
                                let investor = res.data.GetShareholdersReport_Response_1.SymbolReport.Shareholders.Investor;
                                for (let i = 0; i < 10; i++) {
                                    datas.push({
                                        index: i,
                                        investorName: investor[i].Name,
                                        pctOfSharesOutstanding: (investor[i].Holding.PctOfSharesOutstanding).toString() + '%'
                                    })
                                }
                                setBarData(datas);
                            }

                        }
                    }
                } else {
                    setShare([]);
                    setPageList([]);
                    setLoadingPageState(false);
                    message.error(res.message);
                }
            }
        );
    }

    const [cutPage, setCutPage] = useState(1);

    const onChange = (page, pageSize) => {
        shareParams.pageSize = pageSize ? pageSize : '10';
        shareParams.page = page ? page : '1';
        setCutPage(page);
        getShareholderInfo();
    }

    const onShowSizeChange = (current, size) => {
        shareParams.pageSize = size ? size : '10';
        shareParams.page = current ? current : '1';
        setCutPage(current);
        getShareholderInfo();
    }


    //条形图
    const ds = new DataSet();
    const dv = ds.createView().source(barData ? barData : []);
    dv.source(barData ? barData : '').transform({
        type: 'reverse',
    });

    const label = {
        offset: 100, // 数值，设置坐标轴文本 label 距离坐标轴线的距离
        // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
        style: {
            textAlign: 'start', // 文本对齐方向，可取值为： start center end
            fill: 'white', // 文本的颜色
            fontSize: 14, // 文本大小
            textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
        },
    }
    const cols = {};

    return (
        <div>
            <div className={styles.companyInfo}>
                <div className={styles.infoTitle}>
                    <span className={styles.titleTxt}>{oneInfoTitle}</span>
                </div>
                <div className={styles.descBox}>
                    {barData.length > 0 ?
                        <Chart
                            height={500}
                            data={dv}
                            scale={cols}
                            padding={[20, 450, 40, 100]}
                            autoFit
                        >
                            <Coord transpose />
                            <Axis name="pctOfSharesOutstanding" label={label} tickLine={null} line={null} />
                            <Axis name="investorName" visible={false} />
                            <Tooltip shared={true} />
                            <Geom
                                type="interval"
                                position="pctOfSharesOutstanding*investorName"
                                label={["investorName", { style: { fill: 'white' } }]}
                                color={['index', (index) => {
                                    if (index % 2 === 0) {
                                        return '#0161ed';
                                    } else {
                                        return '#389172';
                                    }
                                }]}
                                style={{ color: 'white' }}
                            >
                            </Geom>
                        </Chart>
                        : <Spin className={styles.spinLoading} />}

                </div>
            </div>

            <div className={styles.companyInfo}>
                <div className={styles.infoTitle}>
                    <span className={styles.titleTxt}>{twoInfoTitle}</span>
                </div>
                <div>
                    <div>
                        {keyType == 301 ?
                            <Table loading={loadingPageState}
                                scroll={{ x: 2500 }}
                                rowKey={(record) => record.InvestorPermId}
                                columns={columnsConsolidated}
                                dataSource={pageList}
                                pagination={false} />
                            :
                            keyType == 302 ?
                                <Table loading={loadingPageState}
                                    scroll={{ x: 2500 }}
                                    rowKey={(record) => record.InvestorPermId}
                                    columns={columnsFund}
                                    dataSource={pageList}
                                    pagination={false} /> : ''
                        }

                    </div>
                    <div className={styles.pageBox}>
                        <Pagination
                            total={share.TotalShareholderCount}
                            showTotal={(total) => `${pageTotal} ${share.TotalShareholderCount ? share.TotalShareholderCount : 0} ${pageItems} `}
                            defaultPageSize={20}
                            current={cutPage ? cutPage : 1}
                            onChange={onChange}
                            onShowSizeChange={onShowSizeChange}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
};

export default EquityShareholders;
