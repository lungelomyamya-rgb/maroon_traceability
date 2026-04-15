// UI Components Test - Jest test file
import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

// Test that we can import the colors module
import { commonColors } from '@/lib/theme/colors';

describe('UI Components Module Resolution', () => {
  test('should import colors module successfully', () => {
    expect(commonColors).toBeDefined();
    expect(commonColors.white).toBe('text-white');
    expect(commonColors.black).toBe('text-black');
    expect(commonColors.gray50).toBe('bg-gray-50');
  });

  test('should have all expected color properties', () => {
    const expectedColors = [
      'white', 'black', 'gray50', 'gray100', 'gray200', 
      'gray400', 'gray500', 'gray600', 'gray700', 'gray800', 
      'gray900', 'borderGray200'
    ];

    expectedColors.forEach(color => {
      expect(commonColors).toHaveProperty(color);
    });
  });

  test('should import UI components without errors', async () => {
    const {
      Alert,
      Badge,
      Button,
      Card,
      Input,
      Checkbox,
      Switch,
      Avatar,
      Dialog,
      Separator,
    } = await import('../index');

    expect(Alert).toBeDefined();
    expect(Badge).toBeDefined();
    expect(Button).toBeDefined();
    expect(Card).toBeDefined();
    expect(Input).toBeDefined();
    expect(Checkbox).toBeDefined();
    expect(Switch).toBeDefined();
    expect(Avatar).toBeDefined();
    expect(Dialog).toBeDefined();
    expect(Separator).toBeDefined();
  });

  test('should render Button component', () => {
    const { Button } = require('../index');
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    // Check if it's a button element
    const buttonElement = screen.getByText('Test Button');
    expect(buttonElement.tagName).toBe('BUTTON');
  });

  test('should render Badge component', () => {
    const { Badge } = require('../index');
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
    // Badge should be a span or div with badge styling
    const badgeElement = screen.getByText('Test Badge');
    expect(['SPAN', 'DIV']).toContain(badgeElement.tagName);
  });

  test('should render Card component', () => {
    const { Card, CardHeader, CardTitle, CardContent } = require('../index');
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
    // Card should be a div
    const cardElement = screen.getByText('Test Card').closest('div');
    expect(cardElement).toBeInTheDocument();
  });
});

describe('Module Path Resolution', () => {
  test('should resolve @/lib paths correctly', () => {
    // This should not throw an error if module resolution is working
    expect(() => require('@/lib/theme/colors')).not.toThrow();
  });

  test('should resolve @/components paths correctly', () => {
    // Test that component paths resolve
    expect(() => require('../index')).not.toThrow();
  });

  test('should resolve CSS modules correctly', () => {
    // Test that CSS files are mocked correctly
    // Since we have CSS module mocking in jest.config.js, requiring a CSS file should return an empty object
    const mockCSS = require('./nonexistent.css');
    expect(mockCSS).toBeDefined();
    expect(typeof mockCSS).toBe('object');
  });
});
