import { Descriptions, } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';

const CompanyInfo = (props) => {
  const { allData, keyType } = props;
  const userInfo = getAuthority();//获取用户相关信息
  /** 国际化配置 */
  const intl = useIntl();
  const [company, setCompany] = useState({});//公司信息
  const [shareInfo, setShareInfo] = useState({});//股票信息
  const [otherInfo, setOtherInfo] = useState({});//其余信息

  useEffect(() => {
    setOtherInfo(allData.GetGeneralInformation_Response_1 ? allData.GetGeneralInformation_Response_1.ReferenceInformation : '')
    setShareInfo(allData.GetShareholdersReport_Response_1 ? allData.GetShareholdersReport_Response_1.SymbolReport : '')
    setCompany(allData.GetGeneralInformation_Response_1 ? allData.GetGeneralInformation_Response_1.GeneralInformation : '')
  }, [allData, keyType])

  return (
    <div className={styles.descBox}>
      {keyType == 101 ?
        <Descriptions column={1}>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.companyName',
            defaultMessage: '公司名称',
          })}>{company.CompanyName ? company.CompanyName.Value : ''}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.englishNames',
            defaultMessage: '英文名称',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.registrationPlace',
            defaultMessage: '注册地（国家）',
          })}>{company.CompanyGeneralInfo ? company.CompanyGeneralInfo.IncorporatedIn.Country : ''}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.registrationAddressDetails',
            defaultMessage: '注册地址详细信息',
          })}>{company.ContactInfo ? company.ContactInfo.Address.City : ''}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.setUpDate',
            defaultMessage: '成立日期',
          })}>{company.CompanyGeneralInfo ? company.CompanyGeneralInfo.PublicSince : ''}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.registeredCapital',
            defaultMessage: '注册资本',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.legalRepresentative',
            defaultMessage: '法定代表人',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.actualController',
            defaultMessage: '实际控制人',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.largestShareholder',
            defaultMessage: '第一大股东',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.shareholdingRateLargest',
            defaultMessage: '第一大股东持股比例',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.subordinateIndustry',
            defaultMessage: '所属行业',
          })}>
            {otherInfo.CompanyInformation ? otherInfo.CompanyInformation.IndustryClassification.Taxonomy.length > 0 ?
              otherInfo.CompanyInformation.IndustryClassification.Taxonomy.map((item) => (
                <span>{item.Detail[0].Description}<br /></span>
              ))
              : '' : ''}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.numberEmployees',
            defaultMessage: '员工总数（人）',
          })}>{company.CompanyGeneralInfo ? company.CompanyGeneralInfo.Employees.Value : ''}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.securitiesContacts',
            defaultMessage: '证券事务联系人',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.mainOfficeAddress',
            defaultMessage: '主要办公地址',
          })}>
            {company.ContactInfo ? company.ContactInfo.Address.StreetAddress[0].Value : ''}<span>&nbsp;</span>
            {company.ContactInfo ? company.ContactInfo.Address.City : ''}<span>&nbsp;</span>
            {company.ContactInfo ? company.ContactInfo.Address.Country.Value : ''}<span>&nbsp;</span>
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.mainPhone',
            defaultMessage: '主要电话',
          })}>
            {company.ContactInfo ? company.ContactInfo.PhoneNumbers.Phone[0].CountryPhoneCode : ''}<span>-</span>
            {company.ContactInfo ? company.ContactInfo.PhoneNumbers.Phone[0].CityAreaCode : ''}<span>-</span>
            {company.ContactInfo ? company.ContactInfo.PhoneNumbers.Phone[0].Number : ''}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.mainFax',
            defaultMessage: '主要传真',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.email',
            defaultMessage: '电子邮件',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.companyWebsite',
            defaultMessage: '公司网站',
          })}>{company.WebLinksInfo ? company.WebLinksInfo.WebSite[0].Value : ''}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.accountingYearEndDate',
            defaultMessage: '会计年结日',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.majorBank',
            defaultMessage: '主要往来银行',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.auditor',
            defaultMessage: '核数师',
          })}>{company.Advisors ? company.Advisors.Auditor.Name : ''}</Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.businessScope',
            defaultMessage: '经营范围',
          })}></Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({
            id: 'pages.companyInfo.companyProfile',
            defaultMessage: '公司简介',
          })}>
            {company.TextInfo ? company.TextInfo.Text.length > 0 ? company.TextInfo.Text.map((item) => (
              <span>{item.Type == "Business Summary" ? item.Value : ''}</span>
            )) : '' : ''}
          </Descriptions.Item>
        </Descriptions>
        : keyType == 103 ?
          <Descriptions column={1}>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.stockCode',
              defaultMessage: '股票代码',
            })}>{shareInfo.Symbol ? shareInfo.Symbol.Value : ''}</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.sharesAsName',
              defaultMessage: '股票简称',
            })}>{company.CompanyName ? company.CompanyName.Value : ''}</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.launchDate',
              defaultMessage: '上市日期',
            })}>{company.CompanyGeneralInfo ? company.CompanyGeneralInfo.PublicSince : ''}</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.exchange',
              defaultMessage: '交易所',
            })}>{otherInfo.IssueInformation ? otherInfo.IssueInformation.Issue.length > 0 ? otherInfo.IssueInformation.Issue[0].IssueSpecifics.Exchange.Value : '' : ''}</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.securitiesTypes',
              defaultMessage: '证券类型',
            })}>{otherInfo.IssueInformation ? otherInfo.IssueInformation.Issue.length > 0 ? otherInfo.IssueInformation.Issue[0].IssueSpecifics.ListingType.Value : '' : ''}</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.publicPlate',
              defaultMessage: '上市板',
            })}></Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.parValue',
              defaultMessage: '每股面值',
            })}>{company.IssueInformation ? company.IssueInformation.Issue[0].IssueDetails[0].ParValue : ''}</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.latestTradingUnit',
              defaultMessage: '最新交易单位（股）',
            })}></Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.startingPrice',
              defaultMessage: '首发价格',
            })}></Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.numberOfIPOs',
              defaultMessage: '首发数量（股）',
            })}></Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.currentNumberOfSharesIssued',
              defaultMessage: '当前发行数量（股）',
            })}>{company.IssueInformation ? company.IssueInformation.Issue[0].IssueDetails[0].ShsIssued : ''}</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.currentMarketValue',
              defaultMessage: '当前流通市值',
            })}></Descriptions.Item>
            <Descriptions.Item label='ISIN'>{allData ? allData.issueISIN : ''}</Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.currentTradingStatus',
              defaultMessage: '当前交易状态',
            })}>
              {otherInfo.IssueInformation ? otherInfo.IssueInformation.Issue[0].IssueStatus.Status[0].Value : ''}
              {otherInfo.IssueInformation ? otherInfo.IssueInformation.Issue[0].IssueStatus.Status[1].Value : ''}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.specialAndDelisting',
              defaultMessage: '特别处理和退市',
            })}></Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.delistingDate',
              defaultMessage: '摘牌日期',
            })}></Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({
              id: 'pages.companyInfo.securitiesHaveNames',
              defaultMessage: '证券曾用名',
            })}></Descriptions.Item>
          </Descriptions>
          : ''
      }
    </div>
  )
};

export default CompanyInfo;
