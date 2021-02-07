function effort (user_elev, trail_elev, distance, gain) {

	//https://www.outsideonline.com/2315751/ultimate-backpacking-calorie-estimator
	//https://runnersconnect.net/high-altitude-training-running-performance/#:~:text=For%20every%20thousand%20feet%20of,per%201%2C000%20feet%20of%20altitude.
	
	// effort calc has two parts, additional effort by calories of incline compared to flat distance and 4.4% increased difficulty per 1000ft base elvation difference
	// ( 1 + cal of incline / cal of flat distance ) * base elev difference/1000 * 1.044   //   or *.96 if user is already higher than base elev
	
	var W = 180; // your weight (kg)
	var L = 10; // the weight of your pack (kg)
	var V = 2.5; // your hiking speed (m/s)
	var N = 1; // a “terrain factor” that adjusts the results for different surfaces (for example, a paved road has a terrain factor of 1.0, but a gravel road is 1.2, since it takes more calories to walk on a soft or uneven surface) 

	var G = gain/distance*100; // the grade of any incline (%)

	//if user going to higher elevation
	if (user_elev <= trail_elev) {

		return (1.5*W + 2*(W + L)*(L/W)^2 + N*(W + L)(1.5*V^2 + 0.35*V*G)) / (1.5*W + 2*(W + L)*(L/W)^2 + N*(W + L)(1.5*V^2)) * ((trail_elev - user_elev)/1000*1.044);
 
	}
	else {

		return (1.5*W + 2*(W + L)*(L/W)^2 + N*(W + L)(1.5*V^2 + 0.35*V*G)) / (1.5*W + 2*(W + L)*(L/W)^2 + N*(W + L)(1.5*V^2)) * ((trail_elev - user_elev)/1000*.956);
 
	}
}