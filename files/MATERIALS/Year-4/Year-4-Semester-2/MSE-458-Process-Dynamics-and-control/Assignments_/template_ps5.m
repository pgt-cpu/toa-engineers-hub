function newsim
% 10.450 Spring 2006
% MIT ChE
% function newsim simulates a process under feedback control

% INSTRUCTIONS:
% This is not an application program with good user I/O.  Rather it is a
% template that you adapt to your needs.  Hence, you must modify this file:
% (1) In the section below, assign values to parameters: set the duration
%     and resolution of the simulation, set the sampling rate, and specify
%     how much history is stored for plotting.  In addition, set controller
%     parameters, sensor limits, valve capacity, and initial conditions.
% (2) Describe the process in subfunction "process_derivative"
% (3) Describe the disturbance variable over the course of simulation 
%     in subfunction "disturbance".
% (4) Describe the set point over the course of the simulation in
%     subfunction "setpoint".

% VARIABLE AND PARAMETER NAMES have been prepared for you.
% physical variables important to the process:
% y: controlled variable
% xd: disturbance variable
% xm: manipulated variable
% y1: another output variable
% (The variable y1 is included to illustrate how this template may be
% expanded to more complex processes.  Further variables may be added in
% a simular manner, as well as further controllers placed on these.)

% scaled variables important to the feedback loop:
% ys: measured value of y 
% ysp: set point value
% xco: output of controller

% -- Each of these variables has a value set at the start of simulation, 
% signified by the appendage _init

% -- Each of these variables has an array of its history, signified by
% the appendage _hist

% parameters important to the feedback loop:
% ymin: lower value of y that sensor can read
% ymax: upper value of y that sensor can read
% Kv: gain of the valve
% Kc: gain of the controller
% TI: integral time of the controller
% TD: derivative time of the controller

% parameters concerning passage of time and attentiveness of the controller:
% time_now: starts at zero and proceeds by steps of time_step
% time_step: the time increment at which the process is calculated
% time_end: the time at which the simulation ends
% history_points: the number of points to hold in the history arrays
% steps_between_samples: number of time steps that pass before controller
% looks computes the error ysp - ys and adjusts its output xco.

% USER INPUT SECTION ++++++++++++++++++++++++++++++++++++++++++++++
% Describe what you are simulating: what are the disturbance, manipulated,
% and controlled variables?  What does the process do?
%
%
%
% Specify labels to be used in the plots (around 15 characters max)
t_label = 'time (s)';
y_label = 'label';
y1_label = '(unused)';
xm_label = 'label';
xd_label = 'label';

% Specify parameters that control the simulation itself:
% Time step for computation of process behavior; disturbance and manipulated
% variables are sampled at this interval, and the response variable is 
% computed from one time to the next.  The units are arbitrary, 
% but should be kept consistent with those of other time specifications, 
% such as controller and process parameters.
% Set time_step according to the time scales of the process and
% disturbances: fast changes need small time steps.
time_step = 1;    % arbitrary time units

% Time to end simulation.  Set long enough to see all the interesting
% transients.
time_end = 100;  % arbitrary time units

% Number of time steps to keep in history for plotting.
history_points = 100;  % dimensionless integer

% The controller samples and reacts when this number of time steps has 
% elapsed.  The minumum steps_between_samples is 1; large integers make 
% coarse control.
steps_between_samples = 2;   % dimensionless integer

% Choose whether to print results to screen: 'ys' or 'no'.  Perhaps useful
% for debugging.
is_print = 'no';

% CONTROLLER TUNING
% Controller dimensionless gain (set to 0 to disable controller)
Kc = 0; % (+ or -, as appropriate) 

% Controller integral time (set to ~10000 to disable I-mode)
TI = 10000;  % arbitrary time units

% Controller derivative time (set to 0 to disable D mode)
TD = 0;  % arbitrary time units

% SENSITIVITY OF THE SENSOR
% Sensor range (sensor produces 0-100% scaled input for controller 
% according to these limits)
% Process-specific lower limit
ymin = 0; % units of response variable
% Process-specific upper limit
ymax = 10; % units of response variable

% SIZE OF VALVE
% valve capacity (translates 0-100% controller output into physical 
% manipulated variable)
% NOTE: air-to-close valve has negative gain.
%       air-to-open valve has positive gain.
Kv = 0.002; % m3 s-1 %out-1   

% The simulation begins with the controlled variable y at setpoint value, 
% so that initial error is zero. However, if the specified initial 
% manipulated and disturbance variables are inconsistent with this value, 
% y will vary with time, from the start.
% Here, specify the initial controller output.  It is the controller bias,
% and sets the initial value of the manipulated variable, as well.
xco_init = 50; % controller output is a scaled (0 - 100%) quantity

% As needed, set the initial value of the noncontrolled output, too.
y1_init = 0; % extra variable for more complicated processes
% END OF USER INPUT ------------------------------------------------

% Calculate other initial conditions by using the subfunctions.
time_now = 0;

% Initial xd is taken from the subfunction that describes disturbance.
xd_init = disturbance(time_now); 

% Initial xm is determined by the initial controller output.
xm_init = valve(Kv, xco_init);

% Initial ysp is taken from subfunction that describes set point.
ysp_init = setpoint(time_now); % set point is a scaled (0 - 100%) quantity

% The scaled sensor reading is equal to the scaled set point.
ys_init = ysp_init; 

% y (physical variable) is calculated from ys (scaled variable)
y_init = ys_init*(ymax-ymin)/100. + ymin; % process variable 

% Create arrays for history of the variables; fill them from
% the initial conditions.
sample_time = steps_between_samples * time_step;
time_hist = linspace (-time_step*(history_points-1), 0, history_points);
y_hist = linspace (y_init, y_init, history_points); % physical variable
y1_hist = linspace (y1_init, y1_init, history_points); % extra variable 
ys_hist = linspace (ys_init, ys_init, history_points); % scaled sensor output
ysp_hist = linspace (ysp_init, ysp_init, history_points); % scaled setpt
xco_hist = linspace (xco_init, xco_init, history_points); % scaled controller output
xd_hist = linspace (xd_init, xd_init, history_points); % physical variable
xm_hist = linspace (xm_init, xm_init, history_points); % physical variable

% Define a set of scalars to represent present-time conditions.
% Set these variables to initial conditions before entering the simulation.
y = y_init;
y1 = y1_init;
ys = ys_init;
ysp = ysp_init;
xco = xco_init;
xm = xm_init;
xd = xd_init;

if is_print == 'ys'
    disp '    time    disturb     manip     setpt    control    other'
    disp ([time_now, xd, xm, ysp, y, y1])
end % if

sample_counter = steps_between_samples; % arrange to sample at first time step
is_exit = 'no'; % prepare to stay within controller loop

% Point of view: in this "while loop" we calculate variables around the 
% feedback loop at a newly-updated time_now.  That is, we calculate 
%  y, ys, xco, etc. at this new time.  We obtain previous
% values, as needed, from the history arrays.  The most recent 
% historical value can be found in the last array element, e.g.,
% y_hist(history_points) is the value of y at time_now - time_step.
% The history arrays are updated at the end of the loop.  We are then
% ready to advance the time step for another swing through the loop.
while is_exit == 'no'
    % Advance the time.
    time_now = time_now + time_step;
    
    % Compute the process at this new time.
    % (This step is here because this is a simulated process.)
    [y y1] = process (time_now, time_step, history_points, ...
                      y_hist, y1_hist, xm_hist, xd_hist);
    % NOTE: function "process" returns values for both y and y1.
    
    % Read the sensor; ys returns as scaled (0-100%) variable.
    ys = sensor (y, ymin, ymax);
    
    % Check the set point; ysp is scaled (0-100%) variable
    ysp = setpoint (time_now);
    
    % If it's time, invoke the controller algorithm
    if sample_counter == steps_between_samples
        xco = controller (Kc,TI,TD,history_points,xco_init,... 
            sample_time,steps_between_samples,ys,ysp,...
            xco_hist,ys_hist,ysp_hist);
        sample_counter = 1; % reset the sampling counter
    else
        xco = xco_hist(history_points);   % keep value from previous time step
        sample_counter = sample_counter + 1; % advance the sampling counter
    end
    
    % Output controller signal to valve.
    xm = valve (Kv, xco);
    
    % Update the disturbance.
    % (this step is here because this is a simulated process)
    xd = disturbance (time_now);
    
    % place the present results into the history arrays
    time_hist = time_hist + time_step; % add to every element in array
    y_hist(1:history_points-1)=y_hist(2:history_points); % shift all elements back by one
    y_hist(history_points) = y; % update with most recent value
    y1_hist(1:history_points-1)=y1_hist(2:history_points); % shift all elements back by one
    y1_hist(history_points) = y1; % update with most recent value
    ys_hist(1:history_points-1)=ys_hist(2:history_points); % shift all elements back by one
    ys_hist(history_points) = ys; % update with most recent value
    ysp_hist(1:history_points-1)=ysp_hist(2:history_points); % shift all elements back by one
    ysp_hist(history_points) = ysp; % update with most recent value
    xco_hist(1:history_points-1)=xco_hist(2:history_points); % shift all elements back by one
    xco_hist(history_points) = xco; % update with most recent value
    xm_hist(1:history_points-1)=xm_hist(2:history_points); % shift all elements back by one
    xm_hist(history_points) = xm; % update with most recent value
    xd_hist(1:history_points-1)=xd_hist(2:history_points); % shift all elements back by one
    xd_hist(history_points) = xd; % update with most recent value

    % print current results to screen
    if is_print == 'ys'
        disp '    time    disturb     manip     setpt    control'
        disp ([time_now, xd, xm, ysp, y, y1])
    end % if
    
    if time_now > time_end
        is_exit = 'ys'
    end % if
end % while

% PLOTTING
% Two plots will be made: one in scaled variables, as might be displayed in
% the control room, and a second in physical variables.

% Scaled variables:
y_scale = (y_hist - ymin)/(ymax - ymin) * 100.; % scale the controlled variable

scrsz = get(0,'ScreenSize');
figure('Name','Scaled Variables',...
       'Position',[1 0.3*scrsz(4) 0.45*scrsz(3) 0.45*scrsz(4)] )
subplot (2,1,1);
plot(time_hist,ysp_hist,'c',time_hist,y_scale,'b');
ylabel ('controlled variable');
grid on;

subplot (2,1,2);
plot(time_hist,xco_hist);
ylabel ('controller output');
xlabel (t_label);
grid on;

% Physical variables:
ysp_scale = ysp_hist*(ymax-ymin)/100. + ymin; % render set pt in phys units

figure('Name','Physical Variables',...
       'Position',[0.5*scrsz(3) 0.3*scrsz(4) 0.45*scrsz(3) 0.45*scrsz(4)] )
subplot (4,1,1);
plot(time_hist,ysp_scale,'c',time_hist,y_hist,'b');
ylabel (y_label);
grid on;

subplot (4,1,2);
plot(time_hist,y1_hist);
ylabel (y1_label);
grid on;

subplot (4,1,3);
plot(time_hist,xm_hist);
ylabel (xm_label);
grid on;

subplot (4,1,4);
plot(time_hist,xd_hist);
ylabel (xd_label);
xlabel (t_label);
grid on;

% FINISH - wait for the user to view plots
input('ENTER to conclude');
close all

end % function newsim


function [y y1] = process(...
                      time_now,...
                      time_step,...
                      history_points,...
                      y_hist,...
                      y1_hist,...
                      xm_hist,...
                      xd_hist  )
% Computes y over the past time_step to time_now.
% This function is generic for integrating 2 ODEs; all process description
% is in the subfunction process_derivative.
y_initial = y_hist(history_points);
y1_initial = y1_hist(history_points);
initial_values = [y_initial, y1_initial];
tspan = [time_now - time_step, time_now];
% The MATLAB function ode45 integrates a derivative vector from initial
% values given in init_vals over the time interval tspan.
[t,ycalc] = ode45(@process_derivative,tspan,initial_values,[],...
                  history_points,y_hist,y1_hist,xd_hist,xm_hist);
y = ycalc(size(ycalc,1),1); % get final value on interval
y1 = ycalc(size(ycalc,1),2); % get final value on interval
end % function process


function dydt = process_derivative(...
                      t,...
                      ycalc,...
                      history_points,...
                      y_hist,...
                      y1_hist,...
                      xd_hist,...
                      xm_hist )
% Defines the process in physical variables.  The purpose of this
% subfunction is to calculate the derivatives of the two response
% variables y and y1, where the former is controlled.  The two derivatives
% are stored in the output vector dydt.  The derivatives will generally be
% functions of time t, input variables xd and xm, and output variables 
% y and y1.
% USER INPUT required here ++++++++++++++++++++++++++++++++++++++++
dydt = zeros(2,1); % Increase the row dimension of this array to add variables

% The input variables are assumed to be constant over interval tspan.
dummy_input = xd_hist(history_points); % most recent disturbance variable

% The most recent output variables.
dummy_output = y_hist(history_points); % most recent response variable

% Define parameters.

% Define the derivatives.
dydt(1) = 0; % 
dydt(2) = 0; % define as needed
end % function process_derivative


function xd = disturbance(time_now)
% Describe the disturbance input over time.
% USER INPUT required here ++++++++++++++++++++++++++++++++++++++++
if time_now < 10
    xd = 0.1; % m3 s-1
elseif time_now < 70
        xd = 0.14;
else 
    xd = 0.1; % cm3 s-1
end %if 
end % function disturbance


function ysp = setpoint(time_now)
% The set point is a scaled variable (0-100%).
% USER INPUT required here ++++++++++++++++++++++++++++++++++++++++
if time_now < 40
    ysp = 40;
else
    ysp = 60;
end % if
end % function setpoint


function xco = controller(...
                    Kc,...
                    TI,...
                    TD,...
                    history_points,...
                    xco_init,...
                    sample_time,...
                    steps_between_samples,...
                    ys,...
                    ysp,...
                    xco_hist,...
                    ys_hist,...
                    ysp_hist )
% Computes controller output for input measurement and set point.
% PID or other algorithms can be programmed, as desired.

xco = 0; % controller output will depend on error and parameters
end % function controller


function ys = sensor(y, ymin, ymax)
% The sensor reads the controlled variable and scales it.
ys = (y - ymin)/(ymax - ymin)*100.;
end % function sensor


function xm = valve(Kv, xco)
% The manipulated variable is calculated from the controller output.
    xm = Kv*xco;
end % function valve

