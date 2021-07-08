import { message, Spin, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryTargetAndRecommandation } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
// data-set 可以按需引入，除此之外不要引入别的包
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import { setEmitFlags } from 'typescript';

const ProfitForecastReport = (props) => {
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    //默认ric
    let params = {
        ric: '',
        accessToken: userInfo.accessToken
    }
    /** 国际化配置 */
    const intl = useIntl();

    const [targetForecast, setTargetForecast] = useState({});

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            if (keyType && keyType == 404) {
                setOneInfoTitle('推荐&目标价');
            }
        } else {
            if (keyType && keyType == 404) {
                setOneInfoTitle('Recommendation & Target Price');
            }
        }

        params.ric = ric;
        //查询数据
        queryTargetAndRecommandation(params).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        setTargetForecast(res.data.GetRecommendationSummaries_Response_1 ? res.data.GetRecommendationSummaries_Response_1.RecommendationSummaries.RecommendationSummary : '')
                    }
                } else {
                    message.error(res.message)
                }
            }
        )

    }, [keyType, ric]);



    // 下面的代码会被作为 cdn script 注入 注释勿删
    // CDN START
    const data = [
        { label: '0.1', 放款应还本金: 2800, 价格: 2800, 收益: 2260, 总收益率: 2 },
        { label: '0.2', 放款应还本金: 1800, 价格: 1800, 收益: 1300, 总收益率: 3 },
        { label: '0.3', 放款应还本金: 950, 价格: 950, 收益: 900, 总收益率: 5 },
        { label: '0.4', 放款应还本金: 500, 价格: 500, 收益: -390, 总收益率: 1 },
        { label: '0.5', 放款应还本金: 170, 价格: 170, 收益: 100, 总收益率: 3 },
        { label: '0.6', 放款应还本金: 170, 价格: 170, 收益: 100, 总收益率: 3 },
        { label: '0.7', 放款应还本金: 170, 价格: 170, 收益: -100, 总收益率: 3 },
        { label: '0.8', 放款应还本金: 170, 价格: 170, 收益: 100, 总收益率: 3 },
        { label: '0.9', 放款应还本金: 170, 价格: 170, 收益: 100, 总收益率: 3 },
        { label: '1.0', 放款应还本金: 170, 价格: 170, 收益: 100, 总收益率: 3 },
        { label: '未评分', 放款应还本金: 170, 价格: 170, 收益: 100, 总收益率: 3 },
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'fold',
        fields: ['放款应还本金', '价格', '收益'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
    });
    const scale = {
        总收益率: {
            type: 'linear',
            min: 0,
            max: 10,
        },
    };

    const label = {
        offset: 50,
        // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
        textStyle: {
            textAlign: 'center', // 文本对齐方向，可取值为： start center end
            // fill: 'white', // 文本的颜色
            // fontSize: 14, // 文本大小
            textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
        },
    }

    let chartIns = null;

    const getG2Instance = (chart) => {
        chartIns = chart;
    };

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            <Chart theme='dark' padding={100} forceFit data={dv} scale={scale} onGetG2Instance={getG2Instance}>
                <Legend
                    custom
                    allowAllCanceled
                    items={[
                        { value: '放款应还本金', marker: { symbol: 'square', fill: '#3182bd', radius: 5 } },
                        { value: '价格', marker: { symbol: 'square', fill: '#41a2fc', radius: 5 } },
                        { value: '收益', marker: { symbol: 'square', fill: '#54ca76', radius: 5 } },
                        { value: '总收益率', marker: { symbol: 'hyphen', stroke: '#fad248', radius: 5, lineWidth: 3 } },
                    ]}
                    onClick={(ev) => {
                        const item = ev.item;
                        const value = item.value;
                        const checked = ev.checked;
                        const geoms = chartIns.getAllGeoms();
                        for (let i = 0; i < geoms.length; i++) {
                            const geom = geoms[i];
                            if (geom.getYScale().field === value && value === '总收益率') {
                                if (checked) {
                                    geom.show();
                                } else {
                                    geom.hide();
                                }
                            } else if (geom.getYScale().field === 'value' && value !== '总收益率') {
                                geom.getShapes().map((shape) => {
                                    if (shape._cfg.origin._origin.type == value) {
                                        shape._cfg.visible = !shape._cfg.visible;
                                    }
                                    shape.get('canvas').draw();
                                    return shape;
                                });
                            }
                        }
                    }}
                />
                <Axis name="label" label={label} />
                <Axis name="value" position={'left'} label={label} />
                <Tooltip />
                <Geom
                    type="intervalStack"
                    position="label*value"
                    color={['type', (value) => {
                        if (value === '放款应还本金') {
                            return '#2b6cbb';
                        }
                        if (value === '价格') {
                            return '#41a2fc';
                        }
                        if (value === '收益') {
                            return '#54ca76';
                        }
                    }]}
                    adjust={[{
                        type: 'dodge',
                        marginRatio: 1 / 32,
                    }]}
                />
                <Geom type="line" position="label*总收益率" color="#fad248" size={3} />
                <Geom type="line" position="value*总收益率" color="#fad248" size={3} />

            </Chart>
            <div className={styles.dataTitle}>
                <span>报告期</span>
                <span>（年报）2020/12/31</span>
                <span>（三季报）2020/09/30</span>
                <span>（中报）2020/06/30</span>
                <span>（一季报）2020/03/31</span>
            </div>
            <div>
                <span className={styles.levelTitle}>现金流量</span>
                <span className={styles.levelTitleExt}>（单位：万元，CNY）</span>
            </div>
            <div className={styles.dataContent}>
                <span>经营活动产生的现金流量净额/营业收入</span>
                <span>645.14</span>
                <span>645.14</span>
                <span>645.14</span>
                <span>645.14</span>
            </div>
            <div className={styles.dataContent}>
                <span>经营活动产生的现金流量净额/营业收入</span>
                <span>645.14</span>
                <span>645.14</span>
                <span>645.14</span>
                <span>645.14</span>
            </div>
        </div>
    )
};

export default ProfitForecastReport;
