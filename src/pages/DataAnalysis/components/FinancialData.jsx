import React, { useState, useEffect } from 'react';
import { Spin, Table, Typography, message } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import { queryReportInfo, queryFinancialAnalysis } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { PageContainer } from '@ant-design/pro-layout';
import { dataCas, dataIncome, dataBalance } from './DataUtil';

const { Text } = Typography;
const FinancialData = (props) => {
    const { keyType } = props;

    //"Type": "CAS" 是现金流量表 "Type": "BAL" 资产负债表 "Type": "INC" 损益表
    const userInfo = getAuthority();//获取用户相关信息

    //默认ric
    let params = {
        ric: '',
        accessToken: userInfo.accessToken
    }
    const [oneInfoTitle, setOneInfoTitle] = useState('财务分析');//一级名称
    const [dataState, setDataState] = useState({});
    const [casState, setCasState] = useState({ one: '', two: '', three: '', four: '' });//现金流量表
    const [balState, setBalState] = useState({ one: '', two: '', three: '', four: '' });//资产负债表
    const [incState, setIncState] = useState({ one: '', two: '', three: '', four: '' });//损益表
    /** 国际化配置 */
    const intl = useIntl();

    const getRowClassName = (record, index) => {
        let className = '';
        className = index % 2 === 0 ? "oddRow" : "evenRow";
        return className
    }

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            if (keyType && keyType == 601) {
                setOneInfoTitle('成长能力');
            } else if (keyType && keyType == 602) {
                setOneInfoTitle('现金流量');
            } else if (keyType && keyType == 603) {
                setOneInfoTitle('损益表');
            } else if (keyType && keyType == 604) {
                setOneInfoTitle('资产负债表');
            } else if (keyType && keyType == 605) {
                setOneInfoTitle('盈利能力与收益质量');
            } else if (keyType && keyType == 606) {
                setOneInfoTitle('营运能力');
            } else if (keyType && keyType == 607) {
                setOneInfoTitle('主营构成');
            } else if (keyType && keyType == 608) {
                setOneInfoTitle('资本结构与偿债能力');
            }

        } else {
            if (keyType && keyType == 601) {
                setOneInfoTitle('Growth ability');
            } else if (keyType && keyType == 602) {
                setOneInfoTitle('CASH FLOW STATEMENT');
            } else if (keyType && keyType == 603) {
                setOneInfoTitle('INCOME STATEMENT');
            } else if (keyType && keyType == 604) {
                setOneInfoTitle('BALANCE SHEET');
            } else if (keyType && keyType == 605) {
                setOneInfoTitle('Profitability and earnings quality');
            } else if (keyType && keyType == 606) {
                setOneInfoTitle('Operation ability');
            } else if (keyType && keyType == 607) {
                setOneInfoTitle('The main composition');
            } else if (keyType && keyType == 608) {
                setOneInfoTitle('Capital structure and solvency');
            }
        }
        //查询财务数据
        // queryFinancialAnalysis(params).then(
        //     res => {
        //         if (res.state) {
        //             if (res.data) {
        //             }
        //         } else {
        //             message.error(res.message)
        //         }
        //     }
        // )
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
                                }
                            }
                        }
                    }
                } else {
                    message.error(res.message);
                }
            }
        );
    }, [])



    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            {casState.one && keyType == 602 ?
                <div>
                    <div className={styles.dataTitle}>
                        <span>报告期</span>
                        <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[0].EndDate : ''}</span>
                        <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[1].EndDate : ''}</span>
                        <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[2].EndDate : ''}</span>
                        <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[3].EndDate : ''}</span>
                    </div>
                    <div>
                        <span className={styles.levelTitle}>现金流量</span>
                        <span className={styles.levelTitleExt}>（单位：万元，CNY）</span>
                    </div>
                    {
                        dataCas.map((cas, index) => (
                            <div className={styles.dataContent}
                                className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                <span>{cas.nameCN}</span>
                                <span>
                                    {casState && casState.one && casState.one.length > 0 ? casState.one.map((one) => (
                                        (one.coaCode == cas.type || one.coaCode == cas.typeExt) ? parseInt(one.Value) : ''
                                    )) : ''}
                                </span>
                                <span>
                                    {casState && casState.two && casState.two.length > 0 ? casState.two.map((two) => (
                                        (two.coaCode == cas.type || two.coaCode == cas.typeExt) ? parseInt(two.Value) : ''
                                    )) : ''}
                                </span>
                                <span>
                                    {casState && casState.three && casState.three.length > 0 ? casState.three.map((three) => (
                                        (three.coaCode == cas.type || three.coaCode == cas.typeExt) ? parseInt(three.Value) : ''
                                    )) : ''}
                                </span>
                                <span>
                                    {casState && casState.four && casState.four.length > 0 ? casState.four.map((four) => (
                                        (four.coaCode == cas.type || four.coaCode == cas.typeExt) ? parseInt(four.Value) : ''
                                    )) : ''}
                                </span>
                            </div>
                        ))
                    }
                </div> :
                incState.one && keyType == 603 ?
                    <div>
                        <div className={styles.dataTitle}>
                            <span>报告期</span>
                            <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[0].EndDate : ''}</span>
                            <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[1].EndDate : ''}</span>
                            <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[2].EndDate : ''}</span>
                            <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[3].EndDate : ''}</span>
                        </div>
                        <div>
                            <span className={styles.levelTitle}>营业总收入</span>
                            <span className={styles.levelTitleExt}>（单位：万元，CNY）</span>
                        </div>
                        {
                            dataIncome.map((cas, index) => (
                                <div className={styles.dataContent}
                                    className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                    <span>{cas.nameCN}</span>
                                    <span>
                                        {incState && incState.one && incState.one.length > 0 ? incState.one.map((one) => (
                                            (one.coaCode == cas.type || one.coaCode == cas.typeExt) ? parseInt(one.Value) : ''
                                        )) : ''}
                                    </span>
                                    <span>
                                        {incState && incState.two && incState.two.length > 0 ? incState.two.map((two) => (
                                            (two.coaCode == cas.type || two.coaCode == cas.typeExt) ? parseInt(two.Value) : ''
                                        )) : ''}
                                    </span>
                                    <span>
                                        {incState && incState.three && incState.three.length > 0 ? incState.three.map((three) => (
                                            (three.coaCode == cas.type || three.coaCode == cas.typeExt) ? parseInt(three.Value) : ''
                                        )) : ''}
                                    </span>
                                    <span>
                                        {incState && incState.four && incState.four.length > 0 ? incState.four.map((four) => (
                                            (four.coaCode == cas.type || four.coaCode == cas.typeExt) ? parseInt(four.Value) : ''
                                        )) : ''}
                                    </span>
                                </div>
                            ))
                        }
                    </div> :
                    balState.one && keyType == 604 ?
                        <div>
                            <div className={styles.dataTitle}>
                                <span>报告期</span>
                                <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[0].EndDate : ''}</span>
                                <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[1].EndDate : ''}</span>
                                <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[2].EndDate : ''}</span>
                                <span>{dataState.FinancialStatements ? dataState.FinancialStatements.AnnualPeriods.FiscalPeriod[3].EndDate : ''}</span>
                            </div>
                            <div>
                                <span className={styles.levelTitle}>资产</span>
                                <span className={styles.levelTitleExt}>（单位：万元，CNY）</span>
                            </div>
                            {
                                dataBalance.map((cas, index) => (
                                    <div className={styles.dataContent}
                                        className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                        <span>{cas.nameCN}</span>
                                        <span>
                                            {balState && balState.one && balState.one.length > 0 ? balState.one.map((one) => (
                                                (one.coaCode == cas.type || one.coaCode == cas.typeExt) ? parseInt(one.Value) : ''
                                            )) : ''}
                                        </span>
                                        <span>
                                            {balState && balState.two && balState.two.length > 0 ? balState.two.map((two) => (
                                                (two.coaCode == cas.type || two.coaCode == cas.typeExt) ? parseInt(two.Value) : ''
                                            )) : ''}
                                        </span>
                                        <span>
                                            {balState && balState.three && balState.three.length > 0 ? balState.three.map((three) => (
                                                (three.coaCode == cas.type || three.coaCode == cas.typeExt) ? parseInt(three.Value) : ''
                                            )) : ''}
                                        </span>
                                        <span>
                                            {balState && balState.four && balState.four.length > 0 ? balState.four.map((four) => (
                                                (four.coaCode == cas.type || four.coaCode == cas.typeExt) ? parseInt(four.Value) : ''
                                            )) : ''}
                                        </span>
                                    </div>
                                ))
                            }
                        </div> :
                        < Spin className={styles.spinLoading} />}
        </div>
    )
};

export default FinancialData;
