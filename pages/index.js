import Head from 'next/head'
import { InfoBox } from '../components/InfoBox'
import { Tape } from '../components/Tape'
import { CodeEditor } from '../components/CodeEditor'
import { Memory } from '../components/Memory'
import { useState } from 'react'
import { Controls } from '../components/Controls'
import { init } from '../lib/init'
import { step_twa, step_multi_queue, step_two_stack, step_tm, run_twa, run_multi_queue, run_two_stack, run_tm } from '../lib/runner'

export default function Home() {
  const [states, setStates] = useState(null)
  const [branches, setBranches] = useState([])
  const [result, setResult] = useState('-')
  const [mode, setMode] = useState('twa')
  const [branchIndex, setBranchIndex] = useState(0)
  const [isDisabled1, setIsDisabled1] = useState(false)
  const [isDisabled2, setIsDisabled2] = useState(true)

  function handleSubmit(e) {
    e.preventDefault()

    if (e.nativeEvent.submitter.name !== 'command') return

    const { program, type, input } = Object.fromEntries(new FormData(e.target))
    const button = e.nativeEvent.submitter.value;

    if (button === 'init') {
      const lines = program.split('\n')
      const machine_state = init(lines, type, input)

      setMode(type)
      setStates(machine_state.states)
      setBranches(machine_state.branches)
      setBranchIndex(0)
      setResult('-')

      setIsDisabled1(true)
      setIsDisabled2(false)
    } else if (button === 'step') {
      let res;
      if (mode === 'twa') {
        res = step_twa(states, branches)
      } else if (mode === 'multi-queue') {
        res = step_multi_queue(states, branches)
      } else if (mode === 'two-stack') {
        res = step_two_stack(states, branches)
      } else {
        res = step_tm(states, branches)
      }

      setBranches(res.branches)
      setBranchIndex(branches.length > branchIndex ? branchIndex : 0)
      setResult(res.result)

      if (res.result !== '-') {
        setIsDisabled1(false)
        setIsDisabled2(true)
      }
    } else if (button === 'run') {
      let res;
      if (mode === 'twa') {
        res = run_twa(states, branches)
      } else if (mode === 'multi-queue') {
        res = run_multi_queue(states, branches)
      } else if (mode === 'two-stack') {
        res = run_two_stack(states, branches)
      } else {
        res = run_tm(states, branches)
      }

      setBranches(res.branches)
      setBranchIndex(branches.length > branchIndex ? branchIndex : 0)
      setResult(res.result)

      setIsDisabled1(false)
      setIsDisabled2(true)
    } else {
      setStates(null)
      setBranches([])
      setBranchIndex(0)
      setResult('-')

      setIsDisabled1(false)
      setIsDisabled2(true)
    }

    console.log(mode, e.nativeEvent.submitter.value, program, input)
  }

  function onBranchChange(e) {
    setBranchIndex(e.target.value)
  }

  function onTypeChange(e) {
    setMode(e.target.value)
  }

  function getQueues() {
    if (branches.length > branchIndex) {
      let data = []
      for (let [name, queue] of branches[branchIndex].queues) {
        data.push({ name: 'Queue ' + name, data: queue.getString() })
      }
      return data
    } else {
      return [{ name: 'Queue 1', data: '' }]
    }
  }

  return (
    <>
      <Head>
        <title>Machine Simulator</title>
      </Head>

      <main>
        <section className="max-w-5xl mx-auto my-8 px-4">
          <h1 className="text-3xl text-center font-bold mb-4">Machine Simulator</h1>
          <p>The steps to use the machine simulator are as follows:</p>
          <ol className="list-decimal list-inside">
            <li>Select the machine type from the control menu.</li>
            <li>Write a program for the selected machine type in the program area. See <a href="#syntax"></a>below for syntax and the assumptions made regarding the program.</li>
            <li>Place the input to the machine in the control menu.</li>
            <li>Click on 'Initialize' to initialize the configuration of the machine.</li>
            <li>Click on 'Run' to run the machine until it halts and provides either an 'accept' or 'reject' result. Click on 'Step' to run only a single step of the machine. In the case of a nondeterministic machine, you can select different branches from the control menu at different stages of the machine's run.</li>
            <li>Click on 'Reset' to clear the configuration of the machine. The 'Initialize' button must be clicked again before the machine can be run again.</li>
          </ol>
        </section>
        <section className="space-y-8 px-4 bg-orange-200 py-4">
          <div className="grid grid-cols-[1fr_5fr_1fr] gap-x-4 pt-4">
            <InfoBox text="Current State" data={branches.length > branchIndex ? branches[branchIndex].curr : ''} />
            <Tape data={branches.length > branchIndex ? branches[branchIndex].tape : ' '} index={branches.length > branchIndex ? branches[branchIndex].pointer : 0} />
            <InfoBox text="Result" data={result} />
          </div>
          <form className="grid grid-cols-[2fr_1fr] gap-x-8" onSubmit={handleSubmit}>
            <CodeEditor disabled={isDisabled1} />
            <div className="space-y-8">
              {
                mode === 'two-stack' ?
                  <Memory type="Stacks" data={[
                    { 
                      name: 'Stack 1',
                      data: branches.length > branchIndex ? branches[branchIndex].stacks[0].toString() : ''
                    },
                    { 
                      name: 'Stack 2',
                      data: branches.length > branchIndex ? branches[branchIndex].stacks[1].toString() : ''
                    }
                  ]} />
                  :
                  mode === 'multi-queue' ?
                    <Memory type="Queues" data={getQueues()} />
                    :
                    <></>
              }
              <Controls
                disabled1={isDisabled1}
                disabled2={isDisabled2}
                branchLength={branches.length}
                onBranchChange={onBranchChange}
                onTypeChange={onTypeChange}
              />
            </div>
          </form>
        </section>
        <section className="max-w-5xl mx-auto mt-8 mb-16 px-4" id="syntax">
          <p>Syntax:</p>
          <ol className="list-decimal list-inside">
            <li>
              <span>Two-Way Accepter</span>
              <ul>
                <li>A line can be of the form '<code>&#60;current state&#62;&#93;&#60;state type&#62;&#40;&#60;tape symbol&#62;,&#60;next state&#62;&#41;</code>' where the state types are '<code>L</code>' for left or '<code>R</code>' for right.</li>
                <li>A line can be of the form '<code>&#60;current state&#62;&#93;&#60;state type&#62;</code>' where the state types are '<code>accept</code>' or '<code>reject</code>'.</li>
                <li>Initial states are identified using a line of the form '<code>&#60;current state&#62;&#93;initial</code>'.</li>
              </ul>
            </li>
            <li>
              <span>Two-Way Free Stack/Tape, Multi-Queue Variant</span>
              <ul>
                <li>A line can be of the form '<code>&#60;current state&#62;&#93;&#60;state type&#62;&#40;&#60;tape symbol&#62;,&#60;next state&#62;&#41;</code>' where the state types are '<code>SL</code>' for scan left or '<code>SR</code>' for scan right.</li>
                <li>A line can be of the form '<code>&#60;current state&#62;&#93;&#60;state type&#62;&#40;&#60;queue&#62;,&#60;tape symbol&#62;,&#60;next state&#62;&#41;</code>' where the state types are '<code>R</code>' for reading/dequeuing or '<code>W</code>' for writing/enqueuing.</li>
                <li>Accepting states are identified using a line of the form '<code>&#60;current state&#62;&#93;accept</code>'.</li>
                <li>Initial states are identified by including a line of the form '<code>&#60;current state&#62;&#93;initial</code>'.</li>
              </ul>
            </li>
            <li>
              <span>One-Way, Free Stack/Tape, Two-stack Variant</span>
              <ul>
                <li>A line can be of the form '<code>&#60;current state&#62;&#93;&#60;state type&#62;&#40;&#60;tape/stack symbol&#62;,&#60;next state&#62;&#41;</code>' where the state types are '<code>S</code>' for scan, '<code>R1</code>' for reading/popping from the first stack, '<code>W1</code>' for writing/pushing to the first stack, '<code>R2</code>' for reading/popping from the second stack, or '<code>W2</code>' for writing/pushing to the second stack.</li>
                <li>Accepting states are identified using a line of the form '<code>&#60;current state&#62;&#93;accept</code>'.</li>
                <li>Initial states are identified by including a line of the form '<code>&#60;current state&#62;&#93;initial</code>'.</li>
              </ul>
            </li>
            <li>
              <span>Two-Way, Counter, Single Tape Variant</span>
              <ul>
                <li>A line can be of the form '<code>&#60;current state&#62;&#93;&#60;state type&#62;&#40;&#60;input tape symbol&#62;,&#60;output tape symbol&#62;,&#60;next state&#62;&#41;</code>' where the state types are '<code>L</code>' for left or '<code>R</code>' for right.</li>
                <li>A line can be of the form '<code>&#60;current state&#62;&#93;&#60;state type&#62;</code>' where the state types are '<code>accept</code>' or '<code>reject</code>'.</li>
                <li>Initial states are identified using a line of the form '<code>&#60;current state&#62;&#93;initial</code>'.</li>
              </ul>
            </li>
          </ol>
          <p>Assumptions:</p>
          <ul>
            <li>The program is syntactically correct upon clicking on 'Initialize'.</li>
            <li>An accepting or rejecting state cannot have another state type.</li>
            <li>Accepting and rejecting states are halting states i.e. reaching these state would halt the maching.</li>
          </ul>
        </section>
      </main>
    </>
  )
}