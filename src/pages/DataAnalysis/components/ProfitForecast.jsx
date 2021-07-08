import { Spin, Table, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryForecast, queryReportInfo } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { toDecimal } from '@/utils/utils';
import { dataForecast } from './DataUtil';

const titleNameCn = '(财年)';
const titleNameEn = '(fiscal year)';
const casType = 'Cash Flow Statement';
const incType = 'Income Statement';
const balType = 'Balance Sheet';
const ProfitForecast = (props) => {
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    //默认ric
    let params = {
        ric: '',
        accessToken: userInfo.accessToken
    }
    //资产负债表、损益表、现金流量预测数据    
    let forecastParams = {
        ric: '',
        forecastNumber: 1,     //预测临近几年数据 （1、2、3）接口预测3年的
        accessToken: userInfo.accessToken
    }
    /** 国际化配置 */
    const intl = useIntl();

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            if (keyType && keyType == 401) {
                setOneInfoTitle('现金流量表预测');
            } else if (keyType && keyType == 402) {
                setOneInfoTitle('资产负债表预测');
            } else if (keyType && keyType == 403) {
                setOneInfoTitle('损益表预测');
            }
        } else {
            if (keyType && keyType == 401) {
                setOneInfoTitle('Cash flow statement forecast');
            } else if (keyType && keyType == 402) {
                setOneInfoTitle('Balance sheet forecast');
            } else if (keyType && keyType == 403) {
                setOneInfoTitle('Profit and loss statement forecast');
            }
        }
        historyData(ric);

        //查询近三年的预测数据
        getForecastData(1, ric);
        getForecastData(2, ric);
        getForecastData(3, ric);

    }, [keyType, ric]);

    const [oneForecastData, setOneForecastData] = useState([]);//当年预测
    const [twoForecastData, setTwoForecastData] = useState([]);//明年预测
    const [threeForecastData, setThreeForecastData] = useState([]);//后年预测

    const [dataState, setDataState] = useState({});
    const [casState, setCasState] = useState({ one: '', two: '', three: '', four: '' });//现金流量表
    const [balState, setBalState] = useState({ one: '', two: '', three: '', four: '' });//资产负债表
    const [incState, setIncState] = useState({ one: '', two: '', three: '', four: '' });//损益表


    //预测数据
    const getForecastData = (num, ric) => {
        forecastParams.ric = ric;
        forecastParams.forecastNumber = num;
        queryForecast(forecastParams).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        if (res.data.GetEstimateSummaries_Response_1) {
                            if (res.data.GetEstimateSummaries_Response_1.EstimateSummaries) {
                                if (res.data.GetEstimateSummaries_Response_1.EstimateSummaries.EstimateSummary.length > 0) {
                                    if (num == 1) {
                                        setOneForecastData(res.data.GetEstimateSummaries_Response_1.EstimateSummaries.EstimateSummary[0].Measures ? res.data.GetEstimateSummaries_Response_1.EstimateSummaries.EstimateSummary[0].Measures.Measure : []);
                                    } else if (num == 2) {
                                        setTwoForecastData(res.data.GetEstimateSummaries_Response_1.EstimateSummaries.EstimateSummary[0].Measures ? res.data.GetEstimateSummaries_Response_1.EstimateSummaries.EstimateSummary[0].Measures.Measure : []);
                                    } else if (num == 3) {
                                        setThreeForecastData(res.data.GetEstimateSummaries_Response_1.EstimateSummaries.EstimateSummary[0].Measures ? res.data.GetEstimateSummaries_Response_1.EstimateSummaries.EstimateSummary[0].Measures.Measure : []);
                                    }
                                }
                            }
                        }

                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    //查询历年相关数据
    const historyData = (ric) => {
        params.ric = ric;
        //查询现金流量表数据
        queryReportInfo(params).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        if (res.data.GetFinancialStatementsReports_Response_1 && res.data.GetFinancialStatementsReports_Response_1.FundamentalReports && res.data.GetFinancialStatementsReports_Response_1.FundamentalReports.ReportFinancialStatements) {
                            setDataState(res.data.GetFinancialStatementsReports_Response_1 ? res.data.GetFinancialStatementsReports_Response_1.FundamentalReports.ReportFinancialStatements : '')
                            if (res.data.GetFinancialStatementsReports_Response_1.FundamentalReports.ReportFinancialStatements.FinancialStatements.AnnualPeriods.FiscalPeriod.length > 0) {
                                let item = res.data.GetFinancialStatementsReports_Response_1.FundamentalReports.ReportFinancialStatements.FinancialStatements.AnnualPeriods.FiscalPeriod;
                                if (item.length > 0) {
                                    const casData = { ...casState };
                                    const balData = { ...balState };
                                    const incData = { ...incState };
                                    //第一年
                                    if (item[0].Statement.length > 0) {
                                        item[0].Statement.map((subItem) => {
                                            if (subItem.Type == 'CAS') {
                                                casData.one = subItem.lineItem;
                                            } else if (subItem.Type == 'BAL') {
                                                balData.one = subItem.lineItem;
                                            } else if (subItem.Type == 'INC') {
                                                incData.one = subItem.lineItem;
                                            }
                                        })
                                    }
                                    //第二年
                                    if (item.length > 1) {
                                        if (item[1].Statement.length > 0) {
                                            item[1].Statement.map((subItem) => {
                                                if (subItem.Type == 'CAS') {
                                                    casData.two = subItem.lineItem;
                                                } else if (subItem.Type == 'BAL') {
                                                    balData.two = subItem.lineItem;
                                                } else if (subItem.Type == 'INC') {
                                                    incData.two = subItem.lineItem;
                                                }
                                            })
                                        }
                                    }
                                    //第三年
                                    if (item.length > 2) {
                                        if (item[2].Statement.length > 0) {
                                            item[2].Statement.map((subItem) => {
                                                if (subItem.Type == 'CAS') {
                                                    casData.three = subItem.lineItem;
                                                } else if (subItem.Type == 'BAL') {
                                                    balData.three = subItem.lineItem;
                                                } else if (subItem.Type == 'INC') {
                                                    incData.three = subItem.lineItem;
                                                }
                                            })
                                        }
                                    }
                                    //第四年
                                    if (item.length > 3) {
                                        if (item[3].Statement.length > 0) {
                                            item[3].Statement.map((subItem) => {
                                                if (subItem.Type == 'CAS') {
                                                    casData.four = subItem.lineItem;
                                                } else if (subItem.Type == 'BAL') {
                                                    balData.four = subItem.lineItem;
                                                } else if (subItem.Type == 'INC') {
                                                    incData.four = subItem.lineItem;
                                                }
                                            })
                                        }
                                    }
                                    setCasState(casData);
                                    setBalState(balData);
                                    setIncState(incData);
                                    console.log(incData)
                                }
                            }
                        }
                    }
                } else {
                    message.error(res.message);
                }
            }
        );
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span> <span className={styles.levelTitleExt}>（单位：美元，USD）</span>
            </div>
            {oneForecastData.length > 0 ?
                <div>
                    <div className={styles.dataTitle}>
                        <span>报告期</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[0].FiscalYear : ''}</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[1].FiscalYear : ''}</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[2].FiscalYear : ''}</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{oneForecastData ? oneForecastData[0] ? oneForecastData[0].Periods.Period[0].CalendarYear : '' : ''}</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{twoForecastData ? twoForecastData[0] ? twoForecastData[0].Periods.Period[0].CalendarYear : '' : ''}</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{threeForecastData ? threeForecastData[0] ? threeForecastData[0].Periods.Period[0].CalendarYear : '' : ''}</span>
                    </div>
                    {
                        dataForecast.map((df, index) => (
                            <div className={styles.dataContent}
                                className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                <span>{intl.locale === "zh-CN" ? df.nameCN : df.nameEN}</span>

                                <span>
                                    {df.section == casType ?
                                        <span>
                                            {casState && casState.one && casState.one.length > 0 ? casState.one.map((one) => (
                                                (one.coaCode == df.type) ? parseInt(one.Value) : ''
                                            )) : ''}
                                        </span> :
                                        df.section == incType ?
                                            <span>
                                                {incState && incState.one && incState.one.length > 0 ? incState.one.map((one) => (
                                                    (one.coaCode == df.type) ? parseInt(one.Value) : ''
                                                )) : ''}
                                            </span> :
                                            df.section == balType ?
                                                <span>
                                                    {balState && balState.one && balState.one.length > 0 ? balState.one.map((one) => (
                                                        (one.coaCode == df.type) ? parseInt(one.Value) : ''
                                                    )) : ''}
                                                </span> : ''
                                    }

                                </span>
                                <span>
                                    {df.section == casType ?
                                        <span>
                                            {casState && casState.two && casState.two.length > 0 ? casState.two.map((two) => (
                                                (two.coaCode == df.type) ? parseInt(two.Value) : ''
                                            )) : ''}
                                        </span> :
                                        df.section == incType ?
                                            <span>
                                                {incState && incState.two && incState.two.length > 0 ? incState.two.map((two) => (
                                                    (two.coaCode == df.type) ? parseInt(two.Value) : ''
                                                )) : ''}
                                            </span> :
                                            df.section == balType ?
                                                <span>
                                                    {balState && balState.two && balState.two.length > 0 ? balState.two.map((two) => (
                                                        (two.coaCode == df.type) ? parseInt(two.Value) : ''
                                                    )) : ''}
                                                </span> : ''
                                    }
                                </span>
                                <span>
                                    {df.section == casType ?
                                        <span>
                                            {casState && casState.three && casState.three.length > 0 ? casState.three.map((three) => (
                                                (three.coaCode == df.type) ? parseInt(three.Value) : ''
                                            )) : ''}
                                        </span> :
                                        df.section == incType ?
                                            <span>
                                                {incState && incState.three && incState.three.length > 0 ? incState.three.map((three) => (
                                                    (three.coaCode == df.type) ? parseInt(three.Value) : ''
                                                )) : ''}
                                            </span> :
                                            df.section == balType ?
                                                <span>
                                                    {balState && balState.three && balState.three.length > 0 ? balState.three.map((three) => (
                                                        (three.coaCode == df.type) ? parseInt(three.Value) : ''
                                                    )) : ''}
                                                </span> : ''
                                    }
                                </span>
                                <span>
                                    {oneForecastData && oneForecastData.length > 0 ? oneForecastData.map((one) => (
                                        (one.Abbreviation == df.type) ? one.Periods ? one.Periods.Period ? toDecimal(one.Periods.Period[0].Estimates.Estimate[0].Mean) : '' : '' : ''
                                    )) : ''}
                                </span>
                                <span>
                                    {twoForecastData && twoForecastData.length > 0 ? twoForecastData.map((two) => (
                                        (two.Abbreviation == df.type) ? two.Periods ? two.Periods.Period ? toDecimal(two.Periods.Period[0].Estimates.Estimate[0].Mean) : '' : '' : ''
                                    )) : ''}
                                </span>
                                <span>
                                    {threeForecastData && threeForecastData.length > 0 ? threeForecastData.map((three) => (
                                        (three.Abbreviation == df.type) ? three.Periods ? three.Periods.Period ? toDecimal(three.Periods.Period[0].Estimates.Estimate[0].Mean) : '' : '' : ''
                                    )) : ''}
                                </span>
                            </div>
                        ))
                    }
                </div>
                : < Spin className={styles.spinLoading} />}
        </div>
    )
};

export default ProfitForecast;
