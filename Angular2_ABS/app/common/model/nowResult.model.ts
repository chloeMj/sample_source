
export class NowResult {
	sideSlip_result: any;
	brake_result: any;
	speed_result: any;
	parking_result: any;
	bt_result: any;
}

export class SideSlipResult {
	max: number = 0;
	min: number = 0;
	result: number = 0;
	value: any = [];
	zeroVal: number = 0;
}
export class BrakeResult {
	weight: any = [];
	weight_max: number = 0;
	weight_avg: number = 0;
	weight_zeroVal: number = 0;

	brake_left: any = [];
	brake_left_max: number = 0;
	brake_left_zeroVal: number = 0;
	brake_left_release: number = 0;

	brake_right: any = [];
	brake_right_max: number = 0;
	brake_right_zeroVal: number = 0;
	brake_right_release: number = 0;

	brake_parking_left: any = 0;
	brake_parking_right: any = 0;
	brake_parking_max: any = 0;
	brake_max: any = 0;

	result_paking: any = 0;
	result: number = 0;

}
export class SpeedResult {
	values: any = [];
	result: number = 0;
}
