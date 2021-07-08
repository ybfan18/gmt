import { Spin, Table, message, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryRatiosReport, queryValueData, getIndustryType } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { toDecimal } from '@/utils/utils';
import { dataForecast } from './DataUtil';

const { Option } = Select;
const PeerComparison = (props) => {
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [pageState, setPageState] = useState(1);
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    //估值分析比较
    let params = {
        industryType: '',
        accessToken: userInfo.accessToken
    }
    //市场表现比较参数  
    let marketParams = {
        industryType: '',
        accessToken: userInfo.accessToken
    }
    //行业分类接口
    let industryParams = {
        pageSize: 100,
        pageNumber: 1,
        accessToken: userInfo.accessToken
    }
    /** 国际化配置 */
    const intl = useIntl();

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            if (keyType && keyType == 801) {
                setOneInfoTitle('财务比率比较');
            } else if (keyType && keyType == 802) {
                setOneInfoTitle('财务数据比较');
            } else if (keyType && keyType == 803) {
                setOneInfoTitle('估值分析比较');
            } else if (keyType && keyType == 804) {
                setOneInfoTitle('市场表现比较');
            } else if (keyType && keyType == 805) {
                setOneInfoTitle('盈利预测比较');
            }
        } else {
            if (keyType && keyType == 801) {
                setOneInfoTitle('Financial ratio comparison');
            } else if (keyType && keyType == 802) {
                setOneInfoTitle('Comparison of financial data');
            } else if (keyType && keyType == 803) {
                setOneInfoTitle('Valuation analysis and comparison');
            } else if (keyType && keyType == 804) {
                setOneInfoTitle('Market performance comparison');
            } else if (keyType && keyType == 805) {
                setOneInfoTitle('Comparison of Profit Forecasts');
            }
        }
        //行业分类数据
        getIndustryTypeData();
        getValueData(ric)

    }, [keyType, ric]);

    const [industryState, setIndustryState] = useState([]);
    //行业分类数据
    const getIndustryTypeData = (page) => {
        industryParams.pageNumber = page ? page : 1;
        getIndustryType(industryParams).then(
            res => {
                if (res.state) {
                    setIndustryState(res.data ? res.data.result : [])
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    //市场表现
    const getRatiosReport = (industryType) => {
        marketParams.industryType = 1562;
        queryRatiosReport(marketParams).then(
            res => {
                if (res.state) {
                    if (res.data) {

                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    //估值分析
    const getValueData = (industryType) => {
        params.industryType = 1562;
        queryValueData(params).then(
            res => {
                if (res.state) {
                    if (res.data) {

                    }
                } else {
                    message.error(res.message);
                }
            }
        );
    }

    const companyScroll = (e) => {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            const scrollPage = pageState;
            const nextScrollPage = scrollPage + 1;
            setPageState(nextScrollPage);
            getIndustryTypeData(nextScrollPage); // 调用api方法
        }
    };

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            <div style={{ marginLeft: '32px' }}>
                <FormattedMessage id="pages.peerComparison.industry" defaultMessage="行业:" />
                <Select
                    showSearch
                    onPopupScroll={companyScroll}
                    style={{ width: 200, margin: '24px' }}
                    placeholder={intl.formatMessage({
                        id: 'pages.peerComparison.industry.placeholder',
                        defaultMessage: '请选择行业',
                    })}
                >
                    {industryState.length > 0 ? industryState.map((item) => (
                        <Option key={item.id} value={intl.locale === "zh-CN" ? item.topicDescriptionZh : item.topicDescriptionEn}>{intl.locale === "zh-CN" ? item.topicDescriptionZh : item.topicDescriptionEn}</Option>
                    )) : ''
                    }

                </Select>
            </div>
            <div>
                <div className={styles.titilePeer}>
                    <div>
                        <span>排名</span>
                        <span>代码</span>
                        <span>证券简称</span>
                    </div>
                    <div>
                        <span>总市值</span>
                        <span>流通市值</span>
                    </div>
                    <div>
                        <span className={styles.spanPeer}>
                            <div>市盈率PE</div>
                            <div className={styles.titilePeerRow}>
                                <div>TTM</div>
                                <div>21E</div>
                                <div>22E</div>
                            </div>
                        </span>
                    </div>
                </div>
                <div className={styles.dataPeer}>
                    <div>
                        <span>排名</span>
                        <span>代码</span>
                        <span>证券简称</span>
                    </div>
                    <div>
                        <span>总市值</span>
                        <span>流通市值</span>
                    </div>
                    <div>
                        <span>
                            <div className={styles.dataPeerRow}>
                                <div>TTM</div>
                                <div>21E</div>
                                <div>22E</div>
                            </div>
                        </span>
                    </div>
                </div>
                <div className={styles.dataPeer}>
                    <div>
                        <span>美股20</span>
                        <span></span>
                        <span></span>
                    </div>
                    <div>
                        <span></span>
                        <span></span>
                    </div>
                    <div>
                        <span>
                            <div className={styles.dataPeerRow}>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </span>
                    </div>
                </div>

                <div className={styles.dataPeer}>
                    <div>
                        <span></span>
                        <span></span>
                        <span>中位值</span>
                    </div>
                    <div>
                        <span>总市值</span>
                        <span>流通市值</span>
                    </div>
                    <div>
                        <span>
                            <div className={styles.dataPeerRow}>
                                <div>TTM</div>
                                <div>21E</div>
                                <div>22E</div>
                            </div>
                        </span>
                    </div>
                </div>


            </div>
        </div>
    )
};

export default PeerComparison;
