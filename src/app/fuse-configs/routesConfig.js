import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import ExampleConfig from 'app/main/example/ExampleConfig';
import VendorConfig from 'app/main/vendor/VendorConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import WelcomeConfig from 'app/main/welcome/WelcomeConfig';
import RedemptionConfig from 'app/main/redemption/RedemptionConfig';
import TransactionConfig from 'app/main/transaction/TransactionConfig';
import SliderrConfig from 'app/main/slider/SliderConfig';
import SlidesConfig from 'app/main/slides/SlidesConfig';
import AmenityConfig from 'app/main/amenities/AmenityConfig';
import CategoryConfig from 'app/main/category/CategoryConfig';
import OrderConfig from 'app/main/order/OrderConfig';
import CustomerQueryConfig from 'app/main/operation/CustomerQueryConfig';
import TaskConfig from 'app/main/task/TaskConfig';
import UserConfig from 'app/main/user/UserConfig';
import CustomerConfig from 'app/main/customer/CustomerConfig';
import PremiumKeyConfig from 'app/main/premium_key/PremiumKeyConfig';
import VendorReviewConfig from 'app/main/vendor_review/VendorConfig';
import LogConfig from 'app/main/logs/LogConfig';
import PopupConfig from 'app/main/popup/PopupConfig';
import CorporateLeadConfig from 'app/main/corporate_lead/CorporatLeadConfig';
import LandingListConfig from 'app/main/landing-list/LandingListConfig';
import GlobalNotificationConfig from 'app/main/global-notification/GlobalNotificationConfig';

const routeConfigs = [
	ExampleConfig,
	VendorConfig,
	LoginConfig,
	WelcomeConfig,
	RedemptionConfig,
	TransactionConfig,
	SliderrConfig,
	SlidesConfig,
	AmenityConfig,
	CategoryConfig,
	OrderConfig,
	CustomerQueryConfig,
	TaskConfig,
	UserConfig,
	CustomerConfig,
	PremiumKeyConfig,
	VendorReviewConfig,
	LogConfig,
	PopupConfig,
	CorporateLeadConfig,
	LandingListConfig,
	GlobalNotificationConfig
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		component: () => <Redirect to="/welcome" />
	}
];

export default routes;
