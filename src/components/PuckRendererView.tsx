import type { CSSProperties, FC, ReactNode } from 'react';
import type { PuckData } from '../lib/puck-data';
// import styles from './PuckRendererView.module.css';
import '../styles/global.css';
import '@ui/styles/showcase.css';

interface Block {
  type?: string;
  props?: Record<string, any> & {
    content?: Block[];
    leftColumn?: Block[];
    rightColumn?: Block[];
  };
}

interface Props {
  data: PuckData | null;
}

const bgColorMap: Record<string, string> = {
  inherit: 'inherit',
  'red-300': '#FCA5A5',
  'yellow-100': '#FEF9C3',
};

const showcaseStyles: CSSProperties = {
  height: 'auto',
  backgroundColor: 'var(--color-secondary)',
  backgroundImage:
    'linear-gradient(to bottom, var(--color-primary), rgb(15 23 42 / 0))',
  padding: '30px',
};

const showcaseTextStyles: CSSProperties = {
  maxWidth: '500px',
  color: '#fff',
  textAlign: 'center',
  margin: '50px auto',
};

const PuckRendererView: FC<Props> = ({ data }) => {
  if (!data || !data.content || data.content.length === 0) {
    return <div>No content available.</div>;
  }

  const renderBlocks = (items: Block[] = [], keyPrefix = 'block'): ReactNode =>
    items.map((item, index) => renderBlock(item, `${keyPrefix}-${index}`));

  const renderCardBlock = (blockProps: Record<string, any>, key: string) => {
    const padding =
      typeof blockProps.padding === 'number' ? blockProps.padding : 16;
    const variantStyles =
      blockProps.variant === 'shadow-md'
        ? {
            boxShadow: '0 15px 35px rgba(15,23,42,0.25)',
            border: '1px solid transparent',
            borderRadius: 16,
          }
        : {
            border: '1px solid #e5e7eb',
            borderRadius: 16,
          };
    const backgroundColor =
      blockProps.bgColor && blockProps.bgColor !== 'inherit'
        ? (bgColorMap[blockProps.bgColor] ?? blockProps.bgColor)
        : 'inherit';

    return (
      <div key={key} style={{ padding, backgroundColor, ...variantStyles }}>
        <h2 style={{ marginBottom: 8, fontSize: '1.25rem', fontWeight: 600 }}>
          {blockProps.title}
        </h2>
        <p style={{ lineHeight: 1.6, color: '#475467' }}>
          {blockProps.description}
        </p>
      </div>
    );
  };

  const renderBlock = (block: Block | undefined, key: string): ReactNode => {
    if (!block) return null;
    const { type, props = {} } = block;

    switch (type) {
      case 'ShowcaseBlock':
        return (
          <section key={key} className='showcase'>
            <div className='showcase-text'>
              <h1>{props.heading}</h1>
              <p>{props.text}</p>
            </div>
            {props.showExtra === 'true' && (
              <div
                style={{
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: 24,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  textAlign: 'left',
                }}
              >
                <p
                  style={{
                    letterSpacing: '0.2em',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    opacity: 0.7,
                  }}
                >
                  Demo Note
                </p>
                <p style={{ fontSize: 16, marginTop: 8 }}>
                  This hero block is rendered via Puck content.
                </p>
              </div>
            )}
          </section>
        );
      case 'HeadingBlock':
        return (
          <div key={key} style={{ padding: '16px 0' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: 0 }}>
              {props.title}
            </h1>
          </div>
        );
      case 'CardBlock':
        return renderCardBlock(props, key);
      case 'Card':
        return (
          <div
            key={key}
            style={{
              padding: 16,
              border: '1px solid #e5e7eb',
              borderRadius: 12,
            }}
          >
            <h2 style={{ marginBottom: 6, fontSize: '1.125rem' }}>
              {props.title}
            </h2>
            <p style={{ lineHeight: 1.6, color: '#475467' }}>
              {props.description}
            </p>
          </div>
        );
      case 'CardAboutBlock':
        return (
          <div
            key={key}
            style={{
              padding: 24,
              borderRadius: 24,
              backgroundColor: props.dark === 'true' ? '#0f172a' : '#f1f5f9',
              color: props.dark === 'true' ? '#fff' : '#0f172a',
            }}
          >
            <h3
              style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 12 }}
            >
              {props.title}
            </h3>
            <p style={{ lineHeight: 1.7, opacity: 0.85 }}>
              {props.description}
            </p>
          </div>
        );
      case 'GridBlock':
        return (
          <div
            key={key}
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              padding: '16px 0',
            }}
          >
            {renderBlocks(props.content ?? [], key)}
          </div>
        );
      case 'FixedColumnBlock':
        return (
          <div
            key={key}
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              padding: '16px 0',
            }}
          >
            <div>{renderBlocks(props.leftColumn ?? [], `${key}-left`)}</div>
            <div>{renderBlocks(props.rightColumn ?? [], `${key}-right`)}</div>
          </div>
        );
      case 'MyComponent':
        return (
          <div
            key={key}
            style={{
              padding: 16,
              border: '1px solid #d1d5db',
              borderRadius: 12,
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.125rem' }}>
              Drink:{' '}
              {props.drink === 'orange-juice' ? 'Orange Juice' : props.drink}
            </h3>
            {props.drink === 'water' && props.waterType && (
              <p style={{ margin: 0, color: '#475467' }}>
                Water Type:{' '}
                {props.waterType === 'sparkling' ? 'Sparkling' : 'Still'}
              </p>
            )}
          </div>
        );
      default:
        return (
          <div
            key={key}
            style={{
              padding: 16,
              border: '1px dashed #e5e7eb',
              borderRadius: 12,
              color: '#475467',
            }}
          >
            Unsupported block type: {type ?? 'unknown'}
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {renderBlocks(data.content)}
    </div>
  );
};

export default PuckRendererView;
