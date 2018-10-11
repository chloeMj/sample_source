import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'angular-admin-lte';    //Loading layout module
import { BoxModule } from 'angular-admin-lte';       //Box component
import { DxCircularGaugeModule, DxSelectBoxModule, DxLinearGaugeModule, DxChartModule } from 'devextreme-angular';
import { DndModule } from 'ng2-dnd';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { MainHeaderComponent } from './header/mainHeader.component';
import { SubHeaderComponent } from './header/subHeader.component';
import { AdjustHeaderComponent } from './header/adjustHeader.component';
import { DegreeHeaderComponent } from './header/degreeHeader.component';

import { FooterComponent } from './footer/footer.component';
import { SubFooterComponent } from './footer/subFooter.component';

import { MenubarComponent } from './menubar/menubar.component';

import { MainSectionComponent } from './section/mainSection.component';
import { SubSectionComponent } from './section/subSection.component';
import { AdjustSectionComponent } from './section/adjustSection.component';
import { DegreeSectionComponent } from './section/degreeSection.component';
import { WaitSectionComponent } from './section/waitSection.component';
import { SimulSectionComponent } from './section/simulSection.component';
import { PrintSectionComponent } from './section/printSection.component';
import { EachSectionComponent } from './section/eachSection.component';





import { MainComponent } from './main/main/main.component';
import { AnalogTestComponent } from './main/analogTest/analogTest.component';
import { SetupComponent } from './main/setup/setup.component';
import { ReferenceConfigComponent } from './main/referenceConfig/referenceConfig.component';



import { SideSlipComponent } from './sub/sideSlip/sideSlip.component';
import { BrakeComponent } from './sub/brake/brake.component';
import { awdBrakeComponent } from './sub/awdBrake/awdBrake.component';
import { SpeedComponent } from './sub/speed/speed.component';
import { ResultComponent } from './sub/result/result.component';

import { AdjustSideSlipComponent } from './adjust/sideSlip/sideSlip.component';
import { AdjustBrakeComponent } from './adjust/brake/brake.component';
import { AdjustSpeedComponent } from './adjust/speed/speed.component';

import { DegreeSideSlipComponent } from './degree/sideSlip/sideSlip.component';
import { DegreeBrakeComponent } from './degree/brake/brake.component';
import { DegreeSpeedComponent } from './degree/speed/speed.component';

import { printResultComponent } from './print/result/result.component';

import { EachSideSlipComponent } from './each/sideSlip/sideSlip.component';
import { EachBrakeComponent } from './each/brake/brake.component';
import { EachSpeedComponent } from './each/speed/speed.component';

import { NotFoundComponent } from './not-found/not-found.component';

import { WebSocketService } from './common/service/websocket.service';
import { HttpApiService } from './common/service/http-api.service';
import { StaticDataService } from './common/service/staticData.service';

import { WebSocketSimulService } from './common/service/websocketSimul.service';



import { NgIoModule, SocketIo, NgIoConfig } from 'ng-io';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { environment } from '../environments/environment';


const config: NgIoConfig = { url: environment.socketUrl, options: {} };
const simulConfig: SocketIoConfig = { url: environment.simulUrl, options: {} };



const routes: Routes = [
	{ path: '', redirectTo: 'main', pathMatch: 'full' },
	{
		path: 'main',
		component: MainSectionComponent,
		//canActivate: [AuthGuard],
		data: { title: 'main', subtitle: '' },
		children: [
			{ path: '', redirectTo: 'index', pathMatch: 'full' },
			{ path: 'index', component: MainComponent, data: { title: '메인' } },
			{ path: 'analogTest', component: AnalogTestComponent, data: { title: '아날로그테스트' } },
			{ path: 'setup', component: SetupComponent, data: { title: '설정' } },
			{ path: 'referenceConfig', component: ReferenceConfigComponent, data: { title: '기준값설정' } },
			
			
			{ path: '**', component: NotFoundComponent, data: { title: '잘못된 페이지' } }
		]
	},
	{
		path: 'wait',
		component: WaitSectionComponent,
		//canActivate: [AuthGuard],
		data: { title: 'wait', subtitle: '' }
	},

	{
		path: 'simul',
		component: SimulSectionComponent,
		//canActivate: [AuthGuard],
		data: { title: 'simul', subtitle: '' }
	},
	
	{
		path: 'sub',
		component: SubSectionComponent,
		//canActivate: [AuthGuard],
		data: { title: 'sub', subtitle: '' },
		children: [
			{ path: '', redirectTo: 'sideSlip', pathMatch: 'full' },
			{ path: 'sideSlip', component: SideSlipComponent, data: { title: '사이드슬립' } },
			{ path: 'brake', component: BrakeComponent, data: { title: '브레이크' } },
			{ path: 'awdBrake', component: awdBrakeComponent, data: { title: '사륜 브레이크' } },
			{ path: 'speed', component: SpeedComponent, data: { title: '스피드' } },
			{ path: 'result', component: ResultComponent, data: { title: '결과' } },
			{ path: '**', component: NotFoundComponent, data: { title: '잘못된 페이지' } }
		]
	},
	{
		path: 'adjust',
		component: AdjustSectionComponent,
		//canActivate: [AuthGuard],
		data: { title: 'adjust', subtitle: '' },
		children: [
			{ path: '', redirectTo: 'sideSlip', pathMatch: 'full' },
			{ path: 'sideSlip', component: AdjustSideSlipComponent, data: { title: '사이드슬립' } },
			{ path: 'brake', component: AdjustBrakeComponent, data: { title: '브레이크' } },
			{ path: 'speed', component: AdjustSpeedComponent, data: { title: '스피드' } },
			{ path: '**', component: NotFoundComponent, data: { title: '잘못된 페이지' } }
		]
	},
	{
		path: 'degree',
		component: DegreeSectionComponent,
		//canActivate: [AuthGuard],
		data: { title: 'adjust', subtitle: '' },
		children: [
			{ path: '', redirectTo: 'sideSlip', pathMatch: 'full' },
			{ path: 'sideSlip', component: DegreeSideSlipComponent, data: { title: '사이드슬립' } },
			{ path: 'brake', component: DegreeBrakeComponent, data: { title: '브레이크' } },
			{ path: 'speed', component: DegreeSpeedComponent, data: { title: '스피드' } },
			{ path: '**', component: NotFoundComponent, data: { title: '잘못된 페이지' } }
		]
	},
	{
		path: 'each',
		component: EachSectionComponent,
		data: { title: 'each', subtitle: '' },
		children: [
			{ path: '', redirectTo: 'sideSlip', pathMatch: 'full' },
			{ path: 'sideSlip', component: EachSideSlipComponent, data: { title: '사이드슬립' } },
			{ path: 'brake', component: EachBrakeComponent, data: { title: '브레이크' } },
			{ path: 'speed', component: EachSpeedComponent, data: { title: '스피드' } },
			{ path: '**', component: NotFoundComponent, data: { title: '잘못된 페이지' } }
		]
	},
	{
		path: 'print',
		component: PrintSectionComponent,
		//canActivate: [AuthGuard],
		data: { title: 'print', subtitle: '' },
		children: [
			{ path: '', redirectTo: 'result', pathMatch: 'full' },
			{ path: 'result', component: printResultComponent, data: { title: '결과' } }
		]
	},
	{ path: '**', redirectTo: 'main' }
];





@NgModule({
	declarations: [
		AppComponent,
		MainHeaderComponent,
		SubHeaderComponent,
		AdjustHeaderComponent,
		DegreeHeaderComponent,
		FooterComponent,
		SubFooterComponent,
		MenubarComponent,
		NotFoundComponent,
		MainComponent,
		SetupComponent,
		MainSectionComponent,
		SubSectionComponent,
		AdjustSectionComponent,
		DegreeSectionComponent,
		WaitSectionComponent,
		SimulSectionComponent,
		PrintSectionComponent,
		EachSectionComponent,
		SideSlipComponent,
		AnalogTestComponent,
		BrakeComponent,
		awdBrakeComponent,
		SpeedComponent,
		ResultComponent,
		AdjustSideSlipComponent,
		AdjustBrakeComponent,
		AdjustSpeedComponent,
		DegreeSideSlipComponent,
		DegreeBrakeComponent,
		DegreeSpeedComponent,
		printResultComponent,
		EachSideSlipComponent,
		EachBrakeComponent,
		EachSpeedComponent,
		ReferenceConfigComponent,
		
	],
	imports: [
		CommonModule,
		BrowserModule,
		AngularFontAwesomeModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(routes, { useHash: true }),
		NgIoModule.forRoot(config),
		SocketIoModule.forRoot(simulConfig),
		BoxModule,
		LayoutModule,
		DxCircularGaugeModule,
		DxSelectBoxModule,
		DxLinearGaugeModule,
		DxChartModule,
		DndModule.forRoot(),
	],
	providers: [WebSocketService, StaticDataService, HttpApiService, WebSocketSimulService],
	bootstrap: [AppComponent]
})
export class AppModule { }
