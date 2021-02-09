import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import {secondsToDuration} from '../utils/duration';



function Pomodoro() {
  
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // default starting state of timers
  const defaultDuration = {
    focus: 1500,
    unfocus: 300,
    remaining: 1500,
    session: 1500
  }
  const [duration, setDuration] = useState({...defaultDuration});
  // are we in a focus or break?
  const [isFocus, setIsFocus] = useState(true);
  // is this a session or not?
  const [isSession, setIsSession] = useState(false);
  
  useInterval(
    () => {
      // ToDo: Implement what should happen when the timer is running
      let time = duration;
      time.remaining -= 1;
      if (time.remaining <= 0){
        new Audio(`${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`).play();
        time.remaining = isFocus ? time.unfocus : time.focus;
        time.session = time.remaining;
        setIsFocus(!isFocus);
      }
      setDuration({...time});
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
    setIsSession(true);
  }
  //increase and decrease the focus and break durations from button inputs
  function plusMinusHandler(input){
    let output = duration;
    
    switch (input.target.value){

    
    case "decfocus":
      output.focus = Math.max(output.focus - 300, 300);
      break;
    case "incfocus":
      output.focus = Math.min(output.focus + 300, 3600);
      break;
    case "decbreak":
      output.unfocus = Math.max(output.unfocus - 60, 60);
      break;
    case "incbreak":
      output.unfocus = Math.min(output.unfocus + 60, 900);
      break;
    }
    output.remaining = isFocus ? output.focus : output.unfocus;
    setDuration({...output});

  }
  function Reset(){
    setIsTimerRunning(false);
    setIsSession(false);
    let output = duration;
    output.remaining = output.session;
    setDuration({...output});
  }
  function Focus(){
    return (
      <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {secondsToDuration(duration.focus)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                value="decfocus"
                disabled= {isTimerRunning}
                onClick={plusMinusHandler}
              >
                <span className={classNames({
                  "oi": true,
                  "oi-minus-play": isTimerRunning,
                  'oi-minus-pause': !isTimerRunning
                })}/> -
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                value="incfocus"
                disabled= {isTimerRunning}
                onClick={plusMinusHandler}
              >
                <span className={classNames({
                "oi": true,
                "oi-plus-play": isTimerRunning,
                'oi-plus-pause': !isTimerRunning
              })}/>
                +
              </button>
            </div>
          </div>
        </div>
    );
  }
function Unfocus(){
  return (
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {secondsToDuration(duration.unfocus)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  value="decbreak"
                  disabled= {isTimerRunning}
                  onClick={plusMinusHandler}
                >
                  <span className={classNames({
                  "oi": true,
                  "oi-minus-play": isTimerRunning,
                  'oi-minus-pause': !isTimerRunning
                })}/>
                -
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  value="incbreak"
                  disabled= {isTimerRunning}
                  onClick={plusMinusHandler}
                >
                  <span className={classNames({
                    "oi": true,
                    "oi-plus-play": isTimerRunning,
                    'oi-plus-pause': !isTimerRunning
                  })}/>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      
  );
}
function PausePlayButtons(){
  return (
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
              >
            </button>
            {/* TODO: Implement stopping the current focus or break session and disable when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              title="Stop the session"
              onClick={Reset}
              disabled= {!isSession}
            >
               <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
              ||
              
            </button>
          </div>
        </div>
      </div>
  );
}
function SessionCountdown(){
  /* TODO: This area should show only when a focus or break session is running or pauses */
  if (isSession) {
    return(
      <div>
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) and total duration */}
            
              {isFocus ? (
                <h2 data-testid="session-title"> Focusing for {secondsToDuration(duration.focus)} minutes</h2>
              ) : (
                <h2 data-testid="session-title"> On Break for {secondsToDuration(duration.unfocus)} minutes</h2>
              )}
            {/* TODO: Update message below to include time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
            {secondsToDuration(duration.remaining)} remaining
            </p>
            {!isTimerRunning ? (<h2>Paused</h2>) : (" ")}
          </div>
      </div>
      <div className="row mb-2">
      <div className="col">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={(duration.session - duration.remaining)/duration.session*100} // TODO: Increase aria-valuenow as elapsed time increases
            style={{ width: `${(duration.session - duration.remaining)/duration.session*100}%` }} // TODO: Increase width % as elapsed time increases
          />
        </div>
      </div>
    </div>
  </div>
    )
} else {
  return (<div></div>)
}
}
  return (
    <div className="pomodoro">
      <div className="row">
        <Focus />
        <Unfocus />
      </div>
        <PausePlayButtons />
      <div>
        <SessionCountdown />
        
      </div>
    </div>
  );
}

export default Pomodoro;
