import { message, Table, Pagination, Select, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { queryClassList, queryByOfType, queryEconomicEvent, queryIndicators, queryInterestRate } from '../EconomicCalenda/service';
import { getAuthority } from '@/utils/authority';
import styles from './index.less';
import { getCurrentWeek, prevWeek, nextWeek, weeksCN, weeksEN, isEmpty, timeSpan } from '@/utils/utils';
import moment from 'moment';
import { LeftOutlined, RightOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
let defaultCode = '';//默认国家地区
let defaultType = '';//默认指标类别

let pageTotal = '共';
let pageItems = '条';
let dateFormat = 'YYYY-MM-DDTHH:mm:ss';
const EconomicCalenda = (props) => {
  const userInfo = getAuthority();//获取用户相关信息
  const [loadingState, setLoadingState] = useState(true);//loading
  const [loadingListState, setLoadingListState] = useState(true);
  /** 国际化配置 */
  const intl = useIntl();

  const [oneLevel, setOneLevel] = useState([]);//一级
  const [countryList, setCountryList] = useState([]);//国家地区集合
  const [levelState, setLevelState] = useState(0);
  const [ofType, setOfType] = useState([]);//指标分类
  const [timeState, setTimeState] = useState([]);//当前周
  const [countryCodeState, setCountryCodeState] = useState('');//国家地区
  const [ofTypeValue, setOfTypeValue] = useState('');

  const columnsIndicators = [
    {
      title: <FormattedMessage id="pages.economicCalenda.time" defaultMessage="时间" />,
      dataIndex: 'StartDateTime',
      render: (val, record) => {
        return <span>{moment(record.Duration.StartDateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.data" defaultMessage="数据" />,
      dataIndex: 'EventName',
      render: (val, record) => {
        return <span>{record.EventName}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.indicators" defaultMessage="指标" />,
      dataIndex: 'ActualValue',
      width: 300,
      render: (val, record) => {
        return <span>{ofTypeValue ? ofTypeValue : ''}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.preValue" defaultMessage="前值" />,
      dataIndex: 'PriorValue',
      render: (val, record) => {
        return <span>{record.EconomicIndicator.PriorValue}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.predictiveValue" defaultMessage="预测值" />,
      dataIndex: 'ExpectedValue',
      width: 90,
      render: (val, record) => {
        return <span>{record.EconomicIndicator.ExpectedValue}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.reportedValues" defaultMessage="公布值" />,
      dataIndex: 'ActualValue',
      width: 300,
      render: (val, record) => {
        return <span>{record.EconomicIndicator.ActualValue}</span>
      }
    }
  ]
  const columnsEvent = [
    {
      title: <FormattedMessage id="pages.economicCalenda.time" defaultMessage="时间" />,
      dataIndex: 'LastUpdate',
      width: 200,
      render: (val, record) => {
        return <span>{moment(record.LastUpdate).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.countriesRegion" defaultMessage="国家/地区" />,
      dataIndex: 'CountryCode',
      width: 150,
      render: (val, record) => {
        return <span>{record.CountryCode}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.events" defaultMessage="事件" />,
      dataIndex: 'Name',
      render: (val, record) => {
        return <span>{record.Name}</span>
      }
    },
  ]

  const columnsInterestRate = [
    {
      title: <FormattedMessage id="pages.economicCalenda.countriesRegion" defaultMessage="国家/地区" />,
      dataIndex: 'countryCode',
      render: (val, record) => {
        if (ricNameMap && record.RequestKey.Name) {
          return <span>{ricNameMap[record.RequestKey.Name] ? ricNameMap[record.RequestKey.Name].countryName : ''}</span>
        } else {
          return <span></span>
        }
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.institutions" defaultMessage="机构" />,
      dataIndex: 'inscode',
      render: (val, record) => {
        if (ricNameMap && record.RequestKey.Name) {
          return <span>{ricNameMap[record.RequestKey.Name] ? ricNameMap[record.RequestKey.Name].organization : ''}</span>
        } else {
          return <span></span>
        }
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.interestRateName" defaultMessage="利率名称" />,
      dataIndex: 'rateName',
      render: (val, record) => {
        return <span>{record.Fields.Field[0].Utf8String}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.actualReleaseRate" defaultMessage="实际发布利率" />,
      dataIndex: 'releaseRate',
      render: (val, record) => {
        return <span>{record.Fields.Field[1].Double}</span>
      }
    },
    // {
    //   title: <FormattedMessage id="pages.economicCalenda.upperLimit" defaultMessage="上限" />,
    //   dataIndex: 'up',
    //   render: (val, record) => {
    //     return <span>{record.Fields.Field[1].Double}</span>
    //   }
    // },
    // {
    //   title: <FormattedMessage id="pages.economicCalenda.lowerLimit" defaultMessage="下限" />,
    //   dataIndex: 'down',
    //   render: (val, record) => {
    //     return <span>{record.Fields.Field[1].Double}</span>
    //   }
    // },
    {
      title: <FormattedMessage id="pages.economicCalenda.releaseDate" defaultMessage="发布日期" />,
      dataIndex: 'arriveDate',
      render: (val, record) => {
        return <span>{moment(record.Fields.Field[2].Utf8String).format('YYYY-MM-DD')}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.economicCalenda.nextMeeting" defaultMessage="下次会议日期" />,
      dataIndex: 'nextTime',
      render: (val, record) => {
        return <span>{moment(record.Fields.Field[3].Utf8String).format('YYYY-MM-DD')}</span>
      }
    },
  ]

  let params = {
    language: 'ZH',
    accessToken: userInfo.accessToken
  }

  let paramsType = {
    ofType: '财经指标',
    accessToken: userInfo.accessToken
  }

  //经济事件参数
  let paramsEvent = {
    accessToken: userInfo.accessToken,
    from: moment(timeSpan(7).startDate).format(dateFormat),//UTC 格式时间 2021-05-18T01:00:00  不能为空
    to: moment(timeSpan(7).endDate).format(dateFormat),//UTC  格式时间 2021-05-19T12:00:00 不能为空
    pageSize: 20,  //每页大小 不能为0  不能为空
    page: 1, //页数 不能为0   不能为空    
    sortBy: 'Date',// 写死 使用 Date     不能为空
    sortOrder: 'Descending',  //写死 Ascending   不能为空
    eventTypes: ['GeneralAndPoliticalEvents'],//写死 GeneralAndPoliticalEvents 不能为空
    contextCodeType: 'Geography', //写死 Geography    不能为空
    contextCodeValues: []//选中国家分类的 countryCode  不能为空
  }

  //经济指标参数
  let paramsIndicators = {
    accessToken: userInfo.accessToken,
    from: moment(timeSpan(7).startDate).format(dateFormat),//UTC 格式时间 2021-05-18T01:00:00  不能为空
    to: moment(timeSpan(7).endDate).format(dateFormat),//UTC  格式时间 2021-05-19T12:00:00 不能为空
    pageSize: 10, //每页大小 不能为0  不能为空
    page: 1,//页数 不能为0   不能为空
    marketCountryCode: [], //选中国家分类的 countryCode     //不能为空
    classifications: [],   //指标分类的class_name_en（无论中文还是应为都传这个字段）   //不能为空
  }

  //央行基准利率
  let paramsInterestRate = {
    accessToken: userInfo.accessToken,
    language: "ZH"
  };

  //parentId
  useEffect(() => {
    if (intl.locale === "zh-CN") {
      paramsInterestRate.language = 'ZH';
      pageTotal = '共';
      pageItems = '条';
    } else {
      paramsInterestRate.language = 'EN';
      pageTotal = 'Total';
      pageItems = 'items';
    }

    queryClassList(params).then(
      res => {
        if (res.state) {
          setLoadingState(false);
          if (res.data) {
            if (res.data.length > 0 && res.data[0].subClass) {
              if (res.data[0].subClass.length > 0) {
                for (let i = 0; i < res.data[0].subClass.length; i++) {
                  let item = res.data[0].subClass[i];
                  if (item.ofType === '财经指标') {
                    if (item.subClass.length > 0) {
                      setOneLevel(item.subClass);
                      setLevelState(item.subClass.length > 0 ? item.subClass[0].id : 0);
                      setCountryList(item.subClass.length > 0 ? item.subClass[0].subClass : []);
                      defaultCode = item.subClass.length > 0 ? item.subClass[0].subClass[0].countryCode : '';
                      queryOfTypeList(item.subClass.length > 0 ? item.subClass[0].subClass[0].countryCode : '');
                    }
                  }
                }
              }
            }
          }
        } else {
          setLoadingState(false);
          message.error(res.message);
        }
      }
    );

    setTimeState(getCurrentWeek());
  }, []);

  const queryOfTypeList = (code) => {
    //查询指标分类
    queryByOfType(paramsType).then(
      res => {
        if (res.state) {
          if (res.data) {
            setOfType(res.data ? res.data : []);
            setOfTypeValue(res.data.length > 0 ? res.data[0].classNameEn : '');
            defaultType = res.data.length > 0 ? res.data[0].classNameEn : '';
            queryIndicatorsList(code, res.data.length > 0 ? res.data[0].classNameEn : '');
          }
        } else {
          message.error(res.message);
        }
      }
    );
  }

  const [pageData, setPageData] = useState({});

  const [indicatorsList, setIndicatorsList] = useState([]);
  //查询经济指标数据
  const queryIndicatorsList = (countryCode, of_type) => {
    if (isEmpty(countryCode) && isEmpty(countryCodeState) && isEmpty(defaultCode)) {
      message.error(intl.locale === "zh-CN" ? '国家地区不能为空' : 'Countries and regions cannot be empty');
      return false;
    } else {
      if (!isEmpty(countryCode)) {
        setCountryCodeState(countryCode);
        defaultCode = countryCode;
      }
      paramsIndicators.marketCountryCode = [];
      paramsIndicators.marketCountryCode.push(countryCode ? countryCode : countryCodeState ? countryCodeState : defaultCode);
    }
    if (isEmpty(of_type) && isEmpty(ofTypeValue) && isEmpty(defaultType)) {
      message.error(intl.locale === "zh-CN" ? '指标类别不能为空' : 'The metric category cannot be empty');
      return false;
    } else {
      if (!isEmpty(of_type)) {
        setOfTypeValue(of_type);
        defaultType = of_type;
      }
      paramsIndicators.classifications = [];
      paramsIndicators.classifications.push(of_type ? of_type : ofTypeValue ? ofTypeValue : defaultType);
    }
    setLoadingListState(true);
    queryIndicators(paramsIndicators).then(
      res => {
        setLoadingListState(false);
        if (res.state) {
          setIndicatorsList(res.data ? res.data.GetEconomicHeadlines_Response_1.EconomicHeadlines ? res.data.GetEconomicHeadlines_Response_1.EconomicHeadlines.EconomicHeadline : [] : []);
          setPageData(res.data ? res.data.GetEconomicHeadlines_Response_1.PaginationResult : {});
        } else {
          setLoadingListState(false);
          message.error(res.message);
        }
      }
    );
  }

  const [eventList, setEventList] = useState([]);
  //查询经济事件数据
  const queryEconomicEventList = (countryCode) => {
    if (isEmpty(countryCode) && isEmpty(countryCodeState) && isEmpty(defaultCode)) {
      message.error(intl.locale === "zh-CN" ? '国家地区不能为空' : 'Countries and regions cannot be empty');
      return false;
    } else {
      if (!isEmpty(countryCode)) {
        setCountryCodeState(countryCode);
        defaultCode = countryCode;
      }
      paramsEvent.contextCodeValues = [];
      paramsEvent.contextCodeValues.push(countryCode ? countryCode : countryCodeState ? countryCodeState : defaultCode);
    }
    setLoadingListState(true);
    queryEconomicEvent(paramsEvent).then(
      res => {
        setLoadingListState(false);
        if (res.state) {
          setEventList(res.data ? res.data.GetEventHeadlines_Response_1.EventHeadlines ? res.data.GetEventHeadlines_Response_1.EventHeadlines.Headline : [] : []);
          setPageData(res.data ? res.data.GetEventHeadlines_Response_1.PaginationResult : {});
        } else {
          setLoadingListState(false);
          message.error(res.message);
        }
      }
    );
  }

  const [rateList, setRateList] = useState([]);
  const [ricNameMap, setRicNameMap] = useState({});//国家跟机构的map集合
  //查询央行基准利率
  const queryInterestRateList = () => {
    setLoadingListState(true);
    queryInterestRate(paramsInterestRate).then(
      res => {
        setLoadingListState(false);
        if (res.state) {
          if (res.data) {
            setRateList(res.data.RetrieveItem_Response_3.ItemResponse[0].Item);
            setRicNameMap(res.data.nameMap ? res.data.nameMap : {});
          } else {
            setRateList([]);
          }
        } else {
          setLoadingListState(false);
          message.error(res.message);
        }
      }
    );
  }

  //选中的tab查询对应列表
  const checkClassData = (item) => {
    setLevelState(item.id);
    if (item.subClass) {
      setCountryList(item.subClass);
    }
    if (item.className === "经济数据") {
      queryIndicatorsList(item.subClass ? item.subClass[0].countryCode : '');
    } else if (item.className === "经济事件") {
      queryEconomicEventList(item.subClass ? item.subClass[0].countryCode : '');
    } else if (item.className === "央行基准利率") {
      queryInterestRateList()
    }
  }

  //上周
  const setPreWeek = () => {
    const preweeks = getCurrentWeek(prevWeek(timeState));
    setTimeState(preweeks);
  }

  //下周
  const setNextWeek = () => {
    const nextweeks = getCurrentWeek(nextWeek(timeState));
    setTimeState(nextweeks)
  }

  const [cutPage, setCutPage] = useState(1);


  const onChange = (page, pageSize) => {
    setCutPage(page);
    paramsIndicators.page = page ? page : 1;
    paramsIndicators.pageSize = pageSize ? pageSize : 10;
    paramsEvent.pageSize = pageSize ? pageSize : 10;
    paramsEvent.page = page ? page : 1;
    getCheckedData();
  }

  const onShowSizeChange = (current, size) => {
    setCutPage(current);
    paramsIndicators.page = current ? current : 1;
    paramsIndicators.pageSize = size ? size : 10;
    paramsEvent.pageSize = size ? size : 10;
    paramsEvent.page = current ? current : 1;
    getCheckedData();
  }

  //设置时间值
  const setTimeData = (e) => {
    paramsIndicators.from = moment(e[0]._d).format(dateFormat);
    paramsIndicators.to = moment(e[1]._d).format(dateFormat);
    paramsEvent.from = moment(e[0]._d).format(dateFormat);
    paramsEvent.to = moment(e[1]._d).format(dateFormat);
    getCheckedData();
  }

  const [timeCut, setTimeCut] = useState(new Date());
  //周期时间查询
  const queryCurrentTime = (t) => {
    setTimeCut(t);
    paramsIndicators.from = moment(t).format('YYYY-MM-DD') + 'T00:00:00';
    paramsIndicators.to = moment(t).format('YYYY-MM-DD') + 'T23:59:59';
    paramsEvent.from = moment(t).format('YYYY-MM-DD') + 'T00:00:00';
    paramsEvent.to = moment(t).format('YYYY-MM-DD') + 'T23:59:59';
    getCheckedData();
  }

  //指标类别
  const onChangeOfType = (e) => {
    paramsIndicators.classifications.push(e);
    setOfTypeValue(e);
    defaultType = e;
    queryIndicatorsList('');
  }

  //国家地区
  const onChangeCode = (e) => {
    setCountryCodeState(e);
    defaultCode = e;
    getCheckedData(e);
  }

  //根据tab判断请求的数据
  const getCheckedData = (code) => {
    if (levelState === 370) {
      queryIndicatorsList(code ? code : '');
    } else if (levelState === 371) {
      queryEconomicEventList(code ? code : '');
    }
  }


  return (
    <PageContainer loading={loadingState} className={styles.economic}>
      <div className={styles.oneLevelTitle}>
        {oneLevel ? oneLevel.map((item, index) => (
          <span key={index} value={item.className}
            onClick={() => checkClassData(item)}
            className={[styles.oneLevel, item.id === levelState ? styles.oneLevelActive : ''].join(' ')}>
            {item.className}
          </span>
        )) : ''
        }
      </div>
      <div className={styles.filterTitle}>
        <FilterOutlined /><FormattedMessage id="pages.economicCalenda.filter" defaultMessage="筛选:" />
        <RangePicker name='queryTime'
          className={styles.dateTimeCheck}
          defaultValue={[moment(timeSpan(7).startDate, dateFormat), moment(timeSpan(7).endDate, dateFormat)]}
          onChange={(e) => setTimeData(e)} />
        {levelState === 370 ?
          <Select name='ofType'
            className={styles.filterSelect}
            onChange={(e) => onChangeOfType(e)}
            value={defaultType}
            placeholder={intl.formatMessage({
              id: 'pages.economicCalenda.ofType',
              defaultMessage: '指标类别',
            })}>
            {ofType.length > 0 ? ofType.map((typeItem) => (
              <Option value={typeItem.classNameEn} key={typeItem.id}>{intl.locale === "zh-CN" ? typeItem.classNameZh : typeItem.classNameEn}</Option>
            )) : ''
            }
          </Select> : ''}
        <Select name='countryCode'
          className={styles.filterSelect}
          value={defaultCode}
          onChange={(e) => onChangeCode(e)}
          placeholder={intl.formatMessage({
            id: 'pages.economicCalenda.countriesRegion',
            defaultMessage: '国家/地区',
          })}>
          {countryList.length > 0 ? countryList.map((code) => (
            <Option value={code.countryCode} key={code.id}>{intl.locale === "zh-CN" ? code.className : code.countryCode}</Option>
          )) : ''
          }
        </Select>
      </div>
      <div className={styles.weekTitle}>
        <span className={styles.leftPre} onClick={setPreWeek}>
          <LeftOutlined className={styles.leftOut} /><FormattedMessage id="pages.economicCalenda.lastWeek" defaultMessage="上周" /><span style={{ 'marginLeft': '10px' }}>|</span>
        </span>
        {timeState.length > 0 ? timeState.map((time, index) => (
          <span key={index}
            onClick={() => queryCurrentTime(time)}
            className={[styles.weekSpan, moment(time).format('MM/DD') === moment(timeCut).format('MM/DD') ? styles.weekActive : ''].join(' ')}>
            {intl.locale === "zh-CN" ? weeksCN(moment(time).format('d')) : weeksEN(moment(time).format('d'))}{moment(time).format('MM/DD')}
          </span>
        )) : ''}
        <span className={styles.rightNext} onClick={setNextWeek}>
          <span style={{ 'marginRight': '10px' }}>|</span><FormattedMessage id="pages.economicCalenda.nextWeek" defaultMessage="下周" /><RightOutlined className={styles.rightOut} />
        </span>
      </div>
      <div className={styles.listTable}>
        {levelState === 370 ?
          <Table loading={loadingListState}
            scroll={{ x: '100%' }}
            rowKey={(record) => record.EventId}
            dataSource={indicatorsList}
            columns={columnsIndicators}
            pagination={false} />
          : levelState === 371 ?
            <Table loading={loadingListState}
              scroll={{ x: '100%' }}
              rowKey={(record) => record.EventId}
              columns={columnsEvent}
              dataSource={eventList}
              pagination={false} />
            : levelState === 372 ?

              <Table loading={loadingListState}
                scroll={{ x: '100%' }}
                rowKey={(record, index) => index}
                columns={columnsInterestRate}
                dataSource={rateList}
                pagination={false} />
              : ''}
        {(levelState === 370 || levelState === 371) ?
          <Pagination
            total={pageData.TotalRecords ? pageData.TotalRecords : 0}
            showTotal={(total) => `${pageTotal} ${pageData.TotalRecords ? pageData.TotalRecords : 0} ${pageItems} `}
            defaultPageSize={10}
            current={cutPage ? cutPage : 1}
            onChange={onChange}
            onShowSizeChange={onShowSizeChange}
          />
          : ''}
      </div>
    </PageContainer >
  )
};

export default connect(({ loading }) => ({
  loading: loading
}))(EconomicCalenda);