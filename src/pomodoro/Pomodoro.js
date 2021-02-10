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

  function timesUp(){
    setDuration({...duration,
      remaining: isFocus ? duration.unfocus : duration.focus,
      session: isFocus ? duration.unfocus : duration.focus
    }) 
    setIsFocus(!isFocus);
    const audioEl = document.getElementsByClassName("audio-element")[0]
    audioEl.play()
    //new Audio(`${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`).play();
    //THIS CODE DOESN'T WORK! PLEASE REMOVE IT FROM THE INSTRUCTIONS!!!!

  }

  useInterval(
    () => {
      // ToDo: Implement what should happen when the timer is running
       
      if (isTimerRunning){
        setDuration({...duration, remaining: duration.remaining - 1});
        if (duration.remaining <= 0){
          timesUp();
        }
      }
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setIsTimerRunning(!isTimerRunning);
    setIsSession(true);
  }
  //increase and decrease the focus and break durations from button inputs
  function plusMinusHandler(input){
    switch (input.target.value){
    //change max values to 300 and 60 on decfocus and dec break after done testing alarm!
    
    case "decfocus":
      setDuration({...duration, focus: Math.max(duration.focus - 300, 300),
        remaining: Math.max(duration.focus - 300, 300),
        session: Math.max(duration.focus - 300, 300)});
      break;
    case "incfocus":
      setDuration({...duration, focus: Math.min(duration.focus + 300, 3600),
        remaining: Math.min(duration.focus + 300, 3600),
        session: Math.min(duration.focus + 300, 3600)});
      break;
    case "decbreak":
      setDuration({...duration, unfocus: Math.max(duration.unfocus - 60, 60)});
      
      break;
    case "incbreak":
      setDuration({...duration, unfocus: Math.min(duration.unfocus + 60, 900)});
      break;
    }
    

  }
  function Reset(){
    setIsTimerRunning(false);
    setIsSession(false);
    setIsFocus(true);
    setDuration({...duration, remaining: duration.focus, session: duration.focus})
  }

function PauseButton(){
  return (
    <span className={classNames({
      "oi": true,
      "oi-media-play": !isTimerRunning,
      'oi-media-pause': isTimerRunning
    })}/>
  );
}
function SessionCountdown(props){
  let { focus, unfocus, session, remaining } = props;
  /* TODO: This area should show only when a focus or break session is running or pauses */
  if (isSession) {
    return(
      <div>
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) and total duration */}
            
              {isFocus ? (
                <h2 data-testid="session-title"> Focusing for {secondsToDuration(focus)} minutes</h2>
              ) : (
                <h2 data-testid="session-title"> On Break for {secondsToDuration(unfocus)} minutes</h2>
              )}
            {/* TODO: Update message below to include time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
            {secondsToDuration(remaining)} remaining
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
            aria-valuenow={(session - remaining)/session*100} // TODO: Increase aria-valuenow as elapsed time increases
            style={{ width: `${(session - remaining)/session*100}%` }} // TODO: Increase width % as elapsed time increases
          />
        </div>
      </div>
      <audio className="audio-element">
          <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
        </audio>
    </div>
  </div>
    )
} else {
  return (<div></div>)
}
}
function FocusTime(props){
    let {time} = props;
  return (
    <span className="input-group-text" data-testid="duration-focus">
        {/* TODO: Update this text to display the current focus session duration */}
      Focus Duration: {secondsToDuration(time)}
    </span>
  );
}
function UnfocusTime(props){
  let {time} = props;
  return (
    <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {secondsToDuration(time)}
              </span>
  )
}
  return (
    <div className="pomodoro">
        <div className="row">
      <div className="col">
          <div className="input-group input-group-lg mb-2">
            <FocusTime time={duration.focus} />
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                value="decfocus"
                disabled= {isSession}
                onClick={plusMinusHandler}
              >
                -
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                value="incfocus"
                disabled= {isSession}
                onClick={plusMinusHandler}
              >
               +
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <UnfocusTime time ={duration.unfocus}/>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  value="decbreak"
                  disabled= {isSession}
                  onClick={plusMinusHandler}
                >
                -
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  value="incbreak"
                  disabled= {isSession}
                  onClick={plusMinusHandler}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              <PauseButton />
              &nbsp;
              
            </button>
            {/* TODO: Implement stopping the current focus or break session and disable when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              title="Stop the session"
              data-testid="stop"
              onClick={Reset}
              disabled= {!isSession}
            > 
               <span className="oi oi-media-stop" />
               &nbsp;
            </button>
          </div>
        </div>
      </div>
      <div>
        <SessionCountdown
        focus={duration.focus}
        unfocus={duration.unfocus}
        session={duration.session}
        remaining={duration.remaining}  />
        
      </div>
    </div>
  );
}

export default Pomodoro;
