import React from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie';
import { REDUCER, submit } from 'ducks/login'
import { push } from 'react-router-redux'
import {Form, Input, Button, message} from 'antd'
import * as app from "ducks/app";
import {triggerManualEvent} from "ducks/Milestone";

const FormItem = Form.Item;

const mapStateToProps = (state, props) => ({
  isSubmitForm: state.app.submitForms[REDUCER],
});

let socketUrl = "ws://192.168.1.102:1234";

@connect(mapStateToProps)
@Form.create()
class LoginForm extends React.Component {
    static defaultProps = {}

    state = {
        title: 'LOGIN',
        submit: 'LOGIN'
    };

    ws = new WebSocket(socketUrl);
    socketOpened = false;

    componentDidMount() {
        this.ws.onopen = () => {
            console.log("opened");
            this.socketOpened = true;
        };

        this.ws.onmessage = (evt) => {
            var received_msg = evt.data;
            console.log(received_msg);
            let temp_array = received_msg.split("<");
            if(temp_array.length === 8) {
                let {dispatch} = this.props;
                cookie.save("UserName", temp_array[2].slice(0, -1));
                cookie.save("Password", temp_array[3].slice(0, -1));
                cookie.save("MilestoneUser", temp_array[5].slice(0, -1));
                cookie.save("MilestonePassword", temp_array[6].slice(0, -1));
                cookie.save("UserSecurityClearance", temp_array[7].slice(0, -1));
                dispatch(submit({
                    username: temp_array[5].slice(0, -1),
                    password: temp_array[6].slice(0, -1)
                }));
            } else {
                message.error('Invalid username or password')
            }
        };

        this.ws.onclose = () => {
            // websocket is closed.
            console.log("Connection is closed...");
            this.socketOpened = false;
            document.getElementById("root").style.cursor = "default";
            triggerManualEvent();
        };
    }

    openSocket = (data) => {
        this.ws = new WebSocket(socketUrl);
        this.ws.onopen = () => {
            console.log("opened");
            this.socketOpened = true;
            this.ws.send(data);
        };
        this.ws.onmessage = (evt) => {
            var received_msg = evt.data;
            console.log(received_msg);
            let temp_array = received_msg.split("<");
            if(temp_array.length === 8) {
                let {dispatch} = this.props;
                cookie.save("UserName", temp_array[2].slice(0, -1));
                cookie.save("Password", temp_array[3].slice(0, -1));
                cookie.save("MilestoneUser", temp_array[5].slice(0, -1));
                cookie.save("MilestonePassword", temp_array[6].slice(0, -1));
                cookie.save("UserSecurityClearance", temp_array[7].slice(0, -1));
                dispatch(submit({
                    username: temp_array[5].slice(0, -1),
                    password: temp_array[6].slice(0, -1)
                }));
            } else {
                message.error('Invalid username or password')
            }
        };

        this.ws.onclose = () => {
            // websocket is closed.
            console.log("Connection is closed...");
            this.socketOpened = false;
            document.getElementById("root").style.cursor = "default";
            triggerManualEvent();
        };
        this.ws.onerror = () => {
            message.error('Cannot connect to Safety and Security System.');
        }
        setTimeout(() => {
            if(!this.socketOpened) {
                //message.error('Cannot connect to Safety and Security System.');
            }
        }, 2000);

    };

    // $FlowFixMe
    onSubmit = (isSubmitForm: ?boolean) => event => {
        event.preventDefault()
        const { form } = this.props

            if (!isSubmitForm) {
                form.validateFields((error, values) => {
                    if (!error) {
                        const { password, username } = values;
                        let data = "<UserLogon><" + username + "><" + password + ">";
                        if(!this.socketOpened){
                            this.openSocket(data);
                        }  else {
                            this.ws.send(data);
                            document.getElementById("root").style.cursor = "wait";
                            triggerManualEvent();
                        }
                    }
                })
            }
    };

    render() {
        const { form, isSubmitForm } = this.props;
        return (
            <div
                className="cat__pages__login__block__form"
                style={{
                    padding: '0% 15%',
                    color: 'rgba(0,237,255)'
                }}
            >
                <div
                    className="text-uppercase bg-transparent h5"
                    style={{
                        position: 'absolute',
                        right: '5%',
                        top: '0px',
                        textAlign: 'center',
                        color: 'rgba(0,237,255)',
                        background: 'rgba(22,50,173,0.8)',
                        border: 'solid 2px #00efff',
                        borderRadius: '5px',
                        boxShadow: '0 0 20px 1px #0274ff, inset 0 0 20px rgb(2,116,255)',
                        padding:'0% 4%',
                        //border: '1px solid rgba(0,237,255)'
                    }}
                >
                    {this.state.title}
                </div>
                <br />
                <br />
                <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
                    <FormItem
                        label="USER NAME"
                        style={{
                            color: 'rgba(0,237,255)',
                        }}
                    >
                        {form.getFieldDecorator('username', {
                            initialValue: 'Crew',
                            rules: [
                                { required: true, message: 'Please input user name' },
                            ],
                        })(<Input
                            className="bg-transparent"
                            size="default"
                            style={{
                                color: 'rgba(0,237,255)',
                                border: 'solid 2px #00efff',
                                borderRadius: '5px',
                                boxShadow: '0 0 20px 1px #0274ff'
                            }}
                        />)}
                    </FormItem>
                    <FormItem label="PASSWORD">
                        {form.getFieldDecorator('password', {
                            initialValue: 'Crew',
                            rules: [{ required: true, message: 'Please input your password' }],
                        })(<Input
                            className="bg-transparent"
                            size="default"
                            type="password"
                            style={{
                                color: 'rgba(0,237,255)',
                                border: 'solid 2px #00efff',
                                borderRadius: '5px',
                                boxShadow: '0 0 20px 1px #0274ff'
                            }}
                        />)}
                    </FormItem>
                    <br />
                    <br />
                    <div style={{textAlign: 'center'}}>
                        <Button
                            type="primary"
                            className="bg-transparent"
                            htmlType="submit"
                            loading={isSubmitForm}
                            style={{
                                color: 'rgba(0,237,255)',
                                border: 'solid 2px #00efff',
                                borderRadius: '5px',
                                boxShadow: '0 0 20px 1px #0274ff',
                                width: '50%',
                                background: 'rgba(22,50,173,0.8)',
                            }}
                        >
                            {this.state.submit}
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default LoginForm;
