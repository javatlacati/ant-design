import React from 'react';
import { mount } from 'enzyme';
import Upload from '..';
import UploadList from '../UploadList';
import Form from '../../form';
// @ts-ignore
import { spyElementPrototypes } from '../../__tests__/util/domHook';
import { errorRequest, successRequest } from './requests';
import { setup, teardown } from './mock';
import { UploadFile } from "../interface";

const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

const fileList = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
  },
  {
    uid: '-2',
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
] as UploadFile[];

describe('Upload List', () => {
  // jsdom not support `createObjectURL` yet. Let's handle this.
  const originCreateObjectURL = window.URL.createObjectURL;
  window.URL.createObjectURL = jest.fn(() => '');

  // Mock dom
  let size = { width: 0, height: 0 };
  function setSize(width: number, height: number) {
    size = { width, height };
  }
  const imageSpy = spyElementPrototypes(Image, {
    src: {
      set() {
        if (this.onload) {
          this.onload();
        }
      },
    },
    width: {
      get: () => size.width,
    },
    height: {
      get: () => size.height,
    },
  });

  let drawImageCallback: Function | null = null;
  function hookDrawImageCall(callback: Function) {
    drawImageCallback = callback;
  }
  const canvasSpy = spyElementPrototypes(HTMLCanvasElement, {
    getContext: () => ({
      drawImage: (...args: any) => {
        if (drawImageCallback) drawImageCallback(...args);
      },
    }),

    toDataURL: () => 'data:image/png;base64,',
  });

  // HTMLCanvasElement.prototype

  beforeEach(() => setup());
  afterEach(() => {
    teardown();
    drawImageCallback = null;
  });

  afterAll(() => {
    window.URL.createObjectURL = originCreateObjectURL;
    imageSpy.mockRestore();
    canvasSpy.mockRestore();
  });

  // https://github.com/ant-design/ant-design/issues/4653
  it('should use file.thumbUrl for <img /> in priority', () => {
    const wrapper = mount(
      <Upload defaultFileList={fileList} listType="picture">
        <button type="button">upload</button>
      </Upload>,
    );
    fileList.forEach((file, i) => {
      const linkNode = wrapper.find('.ant-upload-list-item-thumbnail').at(i);
      const imgNode = wrapper.find('.ant-upload-list-item-thumbnail img').at(i);
      expect(linkNode.prop('href')).toBe(file.url);
      expect(imgNode.prop('src')).toBe(file.thumbUrl);
    });
  });

  // https://github.com/ant-design/ant-design/issues/7269
  it('should remove correct item when uid is 0', async () => {
    const list = [
      {
        uid: '0',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
      {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/IQKRngzUuFzJzGzRJXUs.png',
      },
    ] as UploadFile[];
    const wrapper = mount(
      <Upload defaultFileList={list}>
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.find('.ant-upload-list-item').length).toBe(2);
    wrapper
      .find('.ant-upload-list-item')
      .at(0)
      .find('.anticon-close')
      .simulate('click');
    await delay(400);
    wrapper.update();
    expect(wrapper.find('.ant-upload-list-item').hostNodes().length).toBe(1);
  });

  it('should be uploading when upload a file', done => {
    let wrapper: any;
    const onChange = ({ file }: { file: UploadFile }) => {
      if (file.status === 'uploading') {
        expect(wrapper.render()).toMatchSnapshot();
      }
      if (file.status === 'done') {
        expect(wrapper.render()).toMatchSnapshot();
        done();
      }
    };
    wrapper = mount(
      <Upload
        action="http://jsonplaceholder.typicode.com/posts/"
        onChange={onChange}
        customRequest={successRequest}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    wrapper.find('input').simulate('change', {
      target: {
        files: [{ name: 'foo.png' }],
      },
    });
  });

  it('handle error', done => {
    let wrapper: any;
    const onChange = ({ file }: {file: UploadFile}) => {
      if (file.status !== 'uploading') {
        expect(wrapper.render()).toMatchSnapshot();
        done();
      }
    };
    wrapper = mount(
      <Upload
        action="http://jsonplaceholder.typicode.com/posts/"
        onChange={onChange}
        customRequest={errorRequest}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    wrapper.find('input').simulate('change', {
      target: {
        files: [{ name: 'foo.png' }],
      },
    });
  });

  it('does concat filelist when beforeUpload returns false', () => {
    const handleChange = jest.fn();
    const wrapper = mount<Upload>(
      <Upload
        listType="picture"
        defaultFileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        <button type="button">upload</button>
      </Upload>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        files: [{ name: 'foo.png' }],
      },
    });

    expect(wrapper.state().fileList.length).toBe(fileList.length + 1);
    expect(handleChange.mock.calls[0][0].fileList).toHaveLength(3);
  });

  it('should support onPreview', () => {
    const handlePreview = jest.fn();
    const wrapper = mount(
      <Upload listType="picture-card" defaultFileList={fileList} onPreview={handlePreview}>
        <button type="button">upload</button>
      </Upload>,
    );
    wrapper
      .find('.anticon-eye-o')
      .at(0)
      .simulate('click');
    expect(handlePreview).toHaveBeenCalledWith(fileList[0]);
    wrapper
      .find('.anticon-eye-o')
      .at(1)
      .simulate('click');
    expect(handlePreview).toHaveBeenCalledWith(fileList[1]);
  });

  it('should support onRemove', async () => {
    const handleRemove = jest.fn();
    const handleChange = jest.fn();
    const wrapper = mount(
      <Upload
        listType="picture-card"
        defaultFileList={fileList}
        onRemove={handleRemove}
        onChange={handleChange}
      >
        <button type="button">upload</button>
      </Upload>,
    );
    wrapper
      .find('.anticon-delete')
      .at(0)
      .simulate('click');
    expect(handleRemove).toHaveBeenCalledWith(fileList[0]);
    wrapper
      .find('.anticon-delete')
      .at(1)
      .simulate('click');
    expect(handleRemove).toHaveBeenCalledWith(fileList[1]);
    await delay(0);
    expect(handleChange.mock.calls.length).toBe(2);
  });

  describe('should generate thumbUrl from file', () => {
    [
      { width: 100, height: 200, name: 'height large than width' },
      { width: 200, height: 100, name: 'width large than height' },
    ].forEach(({ width, height, name }) => {
      it(name, async () => {
        setSize(width, height);
        const onDrawImage = jest.fn();
        hookDrawImageCall(onDrawImage);

        const handlePreview = jest.fn();
        const newFileList = [...fileList];
        const newFile = {
          ...fileList[0],
          uid: '-3',
          originFileObj: new File([], 'xxx.png', { type: 'image/png' }),
        };
        delete newFile.thumbUrl;
        newFileList.push(newFile);
        const wrapper = mount<Upload>(
          <Upload listType="picture-card" defaultFileList={newFileList} onPreview={handlePreview}>
            <button type="button">upload</button>
          </Upload>,
        );
        wrapper.setState({});
        await delay(0);

        expect(wrapper.state().fileList[2].thumbUrl).not.toBe(undefined);
        expect(onDrawImage).toHaveBeenCalled();

        // Offset check
        const [, offsetX, offsetY] = onDrawImage.mock.calls[0];
        if (width > height) {
          expect(offsetX < 0).toBeTruthy();
        } else {
          expect(offsetY < 0).toBeTruthy();
        }
      });
    });
  });

  it('should non-image format file preview', () => {
    const list = [
      {
        name: 'not-image',
        status: 'done',
        uid: '-3',
        url: 'https://cdn.xxx.com/aaa.zip',
        thumbUrl: 'data:application/zip;base64,UEsDBAoAAAAAADYZYkwAAAAAAAAAAAAAAAAdAAk',
        originFileObj: new File([], 'aaa.zip'),
      },
      {
        name: 'image',
        status: 'done',
        uid: '-4',
        url: 'https://cdn.xxx.com/aaa',
      },
      {
        name: 'not-image',
        status: 'done',
        uid: '-5',
        url: 'https://cdn.xxx.com/aaa.xx',
      },
      {
        name: 'not-image',
        status: 'done',
        uid: '-6',
        url: 'https://cdn.xxx.com/aaa.png/xx.xx',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-7',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-8',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png',
        thumbUrl: 'data:image/png;base64,UEsDBAoAAAAAADYZYkwAAAAAAAAAAAAAAAAdAAk',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-9',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png?query=123',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-10',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png#anchor',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-11',
        url: 'https://cdn.xxx.com/xx.xx/aaa.png?query=some.query.with.dot',
      },
      {
        name: 'image',
        status: 'done',
        uid: '-12',
        url:
          'https://publish-pic-cpu.baidu.com/1296beb3-50d9-4276-885f-52645cbb378e.jpeg@w_228%2ch_152',
        type: 'image/png',
      },
    ] as UploadFile[];

    const wrapper = mount(
      <Upload listType="picture" defaultFileList={list}>
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/7762
  it('work with form validation', () => {
    let errors: any;
    class TestForm extends React.Component {
      handleSubmit = () => {
        // const {
        //   form: { validateFields },
        // } = this.props;
        const props = this.props as any;
        const form: any = props.form;
        form.validateFields((err: any) => {
          errors = err;
        });
      };

      render() {
        // const {
        //   form: { getFieldDecorator },
        // } = this.props;
        const props = this.props as any;
        const getFieldDecorator = props.form.getFieldDecorator as Function;
        return (
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('file', {
                valuePropname: 'fileList',
                getValueFromEvent: (e: any) => e.fileList,
                rules: [
                  {
                    required: true,
                    validator: (_: any, value: any, callback: Function) => {
                      if (!value || value.length === 0) {
                        callback('file required');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <Upload beforeUpload={() => false}>
                  <button type="button">upload</button>
                </Upload>,
              )}
            </Form.Item>
          </Form>
        );
      }
    }

    const App = Form.create()(TestForm);
    const wrapper = mount(<App />);
    wrapper.find(Form).simulate('submit');
    expect(errors.file.errors).toEqual([{ message: 'file required', field: 'file' }]);

    wrapper.find('input').simulate('change', {
      target: {
        files: [{ name: 'foo.png' }],
      },
    });
    wrapper.find(Form).simulate('submit');
    expect(errors).toBeNull();
  });

  it('return when prop onPreview not exists', () => {
    // @ts-ignore
    const wrapper = mount(<UploadList />).instance();
    // @ts-ignore
    expect(wrapper.handlePreview()).toBe(undefined);
  });

  it('previewFile should work correctly', async () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const items = [{ uid: 'upload-list-item', url: '' }] as UploadFile[];
    const wrapper = mount<UploadList>(
      <UploadList listType="picture-card" items={items} locale={{ previewFile: '' }} />,
    ).instance();
    const props = wrapper.props as any;
    return props.previewFile(file);
  });

  it('extname should work correctly when url not exists', () => {
    const items = [{ uid: 'upload-list-item', url: '' }] as UploadFile[];
    const wrapper = mount(
      <UploadList listType="picture-card" items={items} locale={{ previewFile: '' }} />,
    );
    expect(wrapper.find('.ant-upload-list-item-thumbnail').length).toBe(2);
  });

  it('when picture-card is loading, icon should render correctly', () => {
    const items = [{ status: 'uploading', uid: 'upload-list-item' }] as UploadFile[];
    const wrapper = mount(
      <UploadList listType="picture-card" items={items} locale={{ uploading: 'uploading' }} />,
    );
    expect(wrapper.find('.ant-upload-list-item-uploading-text').length).toBe(1);
    expect(wrapper.find('.ant-upload-list-item-uploading-text').text()).toBe('uploading');
  });

  it('onPreview should be called, when url exists', () => {
    const onPreview = jest.fn();
    const items = [{ thumbUrl: 'thumbUrl', url: 'url', uid: 'upload-list-item' }] as UploadFile[];
    const wrapper = mount(
      <UploadList
        listType="picture-card"
        items={items}
        locale={{ uploading: 'uploading' }}
        onPreview={onPreview}
      />,
    );
    wrapper.find('.ant-upload-list-item-thumbnail').simulate('click');
    expect(onPreview).toHaveBeenCalled();
    wrapper.find('.ant-upload-list-item-name').simulate('click');
    expect(onPreview).toHaveBeenCalled();
    wrapper.setProps({ items: [{ thumbUrl: 'thumbUrl', uid: 'upload-list-item' }] });
    wrapper.find('.ant-upload-list-item-name').simulate('click');
    expect(onPreview).toHaveBeenCalled();
  });

  it('upload image file should be converted to the base64', async () => {
    const mockFile = new File([''], 'foo.png', {
      type: 'image/png',
    });

    const wrapper = mount<UploadList>(
      <UploadList listType="picture-card" items={fileList} locale={{ uploading: 'uploading' }} />,
    );
    const instance = wrapper.instance();
    const props = instance.props as any;
    return props.previewFile(mockFile).then((dataUrl: string) => {
      expect(dataUrl).toEqual('data:image/png;base64,');
    });
  });

  it("upload non image file shouldn't be converted to the base64", async () => {
    const mockFile = new File([''], 'foo.7z', {
      type: 'application/x-7z-compressed',
    });

    const wrapper = mount(
      <UploadList listType="picture-card" items={fileList} locale={{ uploading: 'uploading' }} />,
    );
    const instance = wrapper.instance();
    const props = instance.props as any;
    return props.previewFile(mockFile).then((dataUrl: string) => {
      expect(dataUrl).toBe('');
    });
  });

  describe('customize previewFile support', () => {
    function test(name: string, renderInstance: Function) {
      it(name, async () => {
        const mockThumbnail = 'mock-image';
        const previewFile = jest.fn(() => {
          return Promise.resolve(mockThumbnail);
        });
        const file = {
          ...fileList[0],
          originFileObj: renderInstance(),
        };
        delete file.thumbUrl;

        const wrapper = mount(
          <Upload listType="picture" defaultFileList={[file]} previewFile={previewFile}>
            <button type="button" />
          </Upload>,
        );
        wrapper.setState({});
        await delay(0);

        expect(previewFile).toHaveBeenCalledWith(file.originFileObj);
        wrapper.update();

        expect(wrapper.find('.ant-upload-list-item-thumbnail img').prop('src')).toBe(mockThumbnail);
      });
    }

    test('File', () => new File([], 'xxx.png'));
    test('Blob', () => new Blob());
  });
});
