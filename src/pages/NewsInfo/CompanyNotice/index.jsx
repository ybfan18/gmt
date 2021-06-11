import { Button, message, Table, Input, Tree, Modal, Pagination, AutoComplete } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { queryClassList, queryNoticeClass, queryNoticeList, downloadkNotice, queryRicLists, queryNoticeListByRic } from './service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { CarryOutOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fileSizeTransform, isEmpty, mimeType } from '@/utils/utils';

let classId = '';
let treeCHeckId = [];
let codeValue = '';//code值
const { Option } = AutoComplete;

const CompanyNotice = () => {

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
      title: <FormattedMessage id="pages.companyNotice.securitiesCode" defaultMessage="证券代码" />,
      dataIndex: 'mxid',
      render: (val, record) => {
        return <span>{ricData ? ricData[record.submissionInfo[0].companyInfo[0].mxid] : record.submissionInfo[0].companyInfo[0].mxid}</span>
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
    {
      title: <FormattedMessage id="pages.companyNotice.operate" defaultMessage="操作" />,
      dataIndex: 'operate',
      render: (val, record) => {
        return <a className={styles.checkInfo} onClick={() => getNoticeFile(record, 'down')}>下载</a>
      }
    },
  ];

  const userInfo = getAuthority();//获取用户相关信息
  let params = {
    language: 'ZH',
    accessToken: userInfo.accessToken
  }

  //一级分类
  const [twoLevel, setTwoLevel] = useState([]);//二级
  const [threeLevel, setThreeLevel] = useState([]);//三级
  const [levelTwoState, setLevelTwoState] = useState(0);
  const [levelThreeState, setLevelThreeState] = useState(0);
  const [loadingState, setLoadingState] = useState(true);//loading
  const [loadingListState, setLoadingListState] = useState(true);//list loading
  const [pageList, setPageList] = useState([]);
  /** 国际化配置 */
  const intl = useIntl();

  const [treeNotice, setTreeNotice] = useState([]);//树形菜单数据
  const [noticekey, setNoticekey] = useState({});//默认展开key
  const [noticeCheckedKey, setNoticeCheckedKey] = useState({});//默认选中节点
  const [noticeId, setNoticeId] = useState({});//默认选中节点id
  const [checkLevel, setCheckLevel] = useState('');//选中的地区码

  //查询公告列表参数
  let paramsList = {
    twoLevelNewsClassId: '', //国家分类 必填
    stockTypes: [], //股票分类  非必填（只给二级分类的id 如果用户选择一级就把当前一级下的所有二级id传递进来）
    pageSize: 20,
    currentPage: 1,
    accessToken: userInfo.accessToken,
    language: "ZH"
  };

  let pageTotal = '共';
  let pageItems = '条';
  //parentId
  useEffect(() => {
    if (intl.locale === "zh-CN") {
      params.language = 'ZH';
      paramsList.language = 'ZH';
      pageTotal = '共';
      pageItems = '条';
    } else {
      params.language = 'EN';
      paramsList.language = 'EN';
      pageTotal = 'Total';
      pageItems = 'items';
    }
    //查询地区分类
    queryClassList(params).then(
      res => {
        if (res.state) {
          setLoadingState(false);
          if (res.data) {
            if (res.data.length > 0 && res.data[0].subClass) {
              if (res.data[0].subClass.length > 0) {
                for (let i = 0; i < res.data[0].subClass.length; i++) {
                  let item = res.data[0].subClass[i];
                  if (item.ofType === '公司公告') {
                    setTwoLevel(item.subClass);
                    if (item.subClass.length > 0) {
                      if (!levelTwoState) {
                        setLevelTwoState(item.subClass[0].id);
                      }
                      classId = item.subClass[0].id;
                      paramsList.twoLevelNewsClassId = item.subClass[0].id;
                      queryNoticeClassList();
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

    onSetLeafIcon();

  }, []);

  //查询公告分类
  const queryNoticeClassList = () => {
    queryNoticeClass(params).then(
      res => {
        if (res.state) {
          //处理后台数据成树形菜单格式
          if (res.data.length > 0) {
            let treeOneList = [];
            res.data.map((item, index) => {
              if (index === 0) {
                setNoticekey(item.id);
              }
              let treeOne = {
                title: item.stockName,
                key: item.id,
                icon: <CarryOutOutlined />,
              }
              let treeTwoList = [];
              if (item.subsStocks.length > 0) {
                if (index === 0) {
                  setNoticeCheckedKey(item.subsStocks[0].id);
                  setNoticeId(item.subsStocks[0].id);
                  if (paramsList.stockTypes.length > 0) {
                    paramsList.stockTypes.map((st) => {
                      if (st !== item.subsStocks[0].id) {
                        treeCHeckId.push(item.subsStocks[0].id);
                      }
                    })
                  } else {
                    treeCHeckId.push(item.subsStocks[0].id);
                  }
                }
                item.subsStocks.map((subItem) => {
                  let subTreeOne = {
                    title: subItem.stockName,
                    key: subItem.id,
                    icon: <CarryOutOutlined />,
                  }
                  treeTwoList.push(subTreeOne);
                })
              }
              treeOne.children = treeTwoList;
              treeOneList.push(treeOne);
            })
            setTreeNotice(treeOneList);
            queryNoticeLists();
          }
        } else {
          message.error(res.message);
        }
      })
  }

  const [newsList, setNewsList] = useState([]);
  //根据二级目录查列表
  const getNoticeList = (item) => {
    setLoadingState(false);
    //设置不同分类的状态跟数据
    if (item.classLevel === '3') {
      setLevelTwoState(item.id);
      if (item.subClass) {
        setLevelThreeState(item.subClass.length > 0 ? item.subClass[0].id : 0);
        setThreeLevel(item.subClass);
      } else {
        setThreeLevel([]);
      }
    } else if (item.classLevel === '4') {
      setLevelThreeState(item.id);
      if (item.subClass) {
        setLevelThreeState(item.subClass.length > 0 ? item.subClass[0].id : 0);
        setThreeLevel(item.subClass);
      } else {
        // setThreeLevel([]);
      }
    } else if (item.classLevel === '5') {
      setLevelThreeState(item.id);
    }

    if (!item.subClass) {
      paramsList.twoLevelNewsClassId = item.id;
      classId = item.id;
    } else {
      if (item.subClass.length > 0) {
        paramsList.twoLevelNewsClassId = item.subClass[0].id;
        classId = item.subClass[0].id;
      }
    }
    queryNoticeLists();
  }

  const [showLine, setShowLine] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(true);

  const onSelect = (selectedKeys, info) => {
    //判断是否有子节点
    if (info.node.children) {
      let nodeList = [];
      info.node.children.map((nodeItem) => {
        nodeList.push(nodeItem.key);
      })
      paramsList.stockTypes = nodeList;
      treeCHeckId = nodeList;
    } else {
      if (paramsList.stockTypes.length > 0) {
        paramsList.stockTypes.map((st) => {
          if (st !== selectedKeys) {
            paramsList.stockTypes = selectedKeys;
            treeCHeckId = selectedKeys;
          }
        })
      } else {
        paramsList.stockTypes = selectedKeys;
        treeCHeckId = selectedKeys;
      }
    }
    queryNoticeLists();
  };
  //展示线条
  const onSetLeafIcon = () => {
    setShowLeafIcon(false);
    setShowLine({
      showLeafIcon: false,
    });
  };

  const [noticeList, setNoticeList] = useState([]);//公告列表数据
  const [ricData, setRicData] = useState({});//RIC码集合

  //查询公告列表数据
  const queryNoticeLists = () => {
    paramsList.accessToken = userInfo.accessToken;
    paramsList.twoLevelNewsClassId = classId ? classId : '';
    paramsList.stockTypes = treeCHeckId ? treeCHeckId : '';
    if (isEmpty(classId)) {
      setLoadingListState(false);
      return false;
    } else {
      setLoadingListState(true);
      queryNoticeList(paramsList).then(
        res => {
          if (res.state) {
            setLoadingListState(false);
            if (res.data) {
              setNoticeList(res.data.SearchSubmissions_Response_1.submissionStatusAndInfo);
              setPageList(res.data.SearchSubmissions_Response_1);
              setRicData(res.data.ricMap);
            } else {
              setNoticeList([]);
              setPageList([]);
              setRicData([]);
            }

          } else {
            setLoadingListState(false);
            message.error(res.message);
          }
        }
      );
    }

  }

  const tableWdith = window.innerWidth - 470;//表格区域宽度

  const [modelState, setModelState] = useState(false);
  const [viewUrl, setViewUrl] = useState({});

  //文件下载参数
  let fileParams = {
    fileType: '',
    dcn: '',
    originalFileName: '',
    size: '',
    accessToken: userInfo.accessToken
  }
  const getNoticeFile = (item, type) => {
    setLoadingListState(true);
    let { fileType, DCN, originalFileName, size } = item.submissionInfo[0];
    fileParams.fileType = fileType;
    fileParams.dcn = DCN;
    fileParams.originalFileName = DCN;
    fileParams.size = size;
    downloadkNotice(fileParams).then(
      res => {
        setLoadingListState(false);
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
  //关闭弹框
  const handleCancel = () => {
    setModelState(false);
  }

  //赋值参数
  const setInputValue = (e) => {
    codeValue = e.target.defaultValue;
  }

  const [cutPage, setCutPage] = useState(1);

  const onChange = (page, pageSize) => {
    paramsList.pageSize = pageSize ? pageSize : '10';
    paramsList.currentPage = page ? page : '1';
    setCutPage(page);
    queryNoticeLists();
  }

  const onShowSizeChange = (current, size) => {
    paramsList.pageSize = size ? size : '10';
    paramsList.currentPage = current ? current : '1';
    setCutPage(current);
    queryNoticeLists();
  }

  //ric码查询结果
  const [ricList, setRicList] = useState([]);
  let ricParams = {
    ric: '',
    pageSize: 10,
    page: 1,
    accessToken: userInfo.accessToken,
  }

  //模糊查询ric集合
  const queryRicListData = (e) => {
    ricParams.ric = e;
    codeValue = e;
    queryRicLists(ricParams).then(
      res => {
        if (res.state) {
          if (res.data && res.data.result && res.data.result.length > 0) {
            setRicList(res.data.result)
          }
        } else {
          message.error(res.message);
        }
      }
    );
  }

  //查询公告列表参数通过ric
  let paramsRicList = {
    ric: '', //ric 必填
    stockTypes: [], //股票分类  非必填（只给二级分类的id 如果用户选择一级就把当前一级下的所有二级id传递进来）
    pageSize: 20,
    currentPage: 1,
    accessToken: userInfo.accessToken,
    language: "ZH"
  };

  const queryNoticeListByRicInput = () => {
    paramsRicList.ric = codeValue ? codeValue : '';
    paramsRicList.stockTypes = treeCHeckId ? treeCHeckId : '';
    setLoadingListState(true);
    queryNoticeListByRic(paramsRicList).then(
      res => {
        if (res.state) {
          setLoadingListState(false);
          if (res.data) {
            setNoticeList(res.data.SearchSubmissions_Response_1.submissionStatusAndInfo);
            setPageList(res.data.SearchSubmissions_Response_1);
            setRicData(res.data.ricMap);
          } else {
            setNoticeList([]);
            setPageList([]);
            setRicData([]);
          }

        } else {
          setLoadingListState(false);
          message.error(res.message);
        }
      }
    );
  }


  return (
    <PageContainer loading={loadingState} className={styles.notcieContent}>
      <div className={styles.twoLevelTitle}>
        {twoLevel ? twoLevel.map((item, index) => (
          <span key={index} value={item.className}
            onClick={() => getNoticeList(item)}
            className={[styles.twoLevel, item.id === levelTwoState ? styles.twoLevelActive : ''].join(' ')}>
            {item.className}
          </span>
        )) : ''
        }
      </div>
      <div className={[styles.twoLevelTitle, twoLevel.length > 0 ? styles.threeLevelTitle : ''].join(' ')}>
        {threeLevel ? threeLevel.map((item, index) => (
          <span key={index} value={item.className}
            onClick={() => getNoticeList(item)}
            className={[styles.threeLevel, item.id === levelThreeState ? styles.threeLevelActive : styles.txtCoWh].join(' ')}>
            {item.className}
          </span>
        )) : ''
        }
      </div>
      <div style={{ 'width': '100%' }}>
        <div className={styles.treeNotice}>
          <Tree
            showLine={showLine}
            showIcon={false}
            defaultExpandedKeys={[noticekey]}
            defaultSelectedKeys={[noticeCheckedKey]}
            treeData={treeNotice}
            onSelect={onSelect}
          />
        </div>
        <div className={styles.tableNotice}>
          <AutoComplete className={styles.searchInput}
            onChange={(e) => queryRicListData(e)}
            // open={true}
            name='code'
            style={{ marginTop: '-2px' }}
            placeholder={intl.formatMessage({
              id: 'pages.companyNotice.code',
              defaultMessage: '输入代码',
            })} >
            {ricList.map((ric, index) => (
              <Option key={index} value={ric.ric}>
                {ric.ric}
              </Option>
            ))}
          </AutoComplete>
          <Button onClick={queryNoticeListByRicInput}>
            <FormattedMessage id="pages.companyNotice.search" defaultMessage="搜索" />
          </Button>
          <Table loading={loadingListState}
            scroll={{ x: '100%' }}
            rowKey={(record) => record.commonID}
            columns={columns}
            dataSource={noticeList}
            pagination={false} />
          <Pagination
            total={pageList.totalHit}
            showTotal={(total) => `${pageTotal} ${pageList.totalHit ? pageList.totalHit : 0} ${pageItems} `}
            defaultPageSize={20}
            // defaultCurrent={1}
            current={cutPage ? cutPage : 1}
            onChange={onChange}
            onShowSizeChange={onShowSizeChange}
          />

        </div>
      </div>
      <div>
        <Modal title='文件预览'
          footer={null}
          onCancel={handleCancel}
          visible={modelState}
        >

        </Modal>
      </div>
    </PageContainer>
  )
};

export default CompanyNotice;
