import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import AppFloatButton from 'src/components/AppFloatButton';
import HelpIcon from '@mui/icons-material/Help';

export default {
    title: "AppFloatButton",
    component: AppFloatButton
} as ComponentMeta<typeof AppFloatButton>;

const Template: ComponentStory<typeof AppFloatButton> = (args) => <AppFloatButton {...args}/>

export const AppFloatButtonStory = Template.bind({});


// More on args: https://storybook.js.org/docs/react/writing-stories/args
AppFloatButtonStory.args = {
  color: "primary",
  children: <HelpIcon/>
};
