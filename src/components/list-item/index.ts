import { Component } from 'herbjs';

interface IComponentData { }

interface IComponentProps {
  item: IListItem;
  onRemoveItem: any;
  onToggleFinished: any;
  onViewItem: any;
}

interface IComponentMethods {
  toggleFinished(event: any): void;
  removeItem(event: any): void;
  viewItem(event: any): void;
}

interface IListItem {
  content: string;
  finished: boolean;
  index: number;
}

Component<IComponentData, IComponentProps, IComponentMethods>({
  props: {
    item: {
      content: '',
      finished: false,
      index: 0,
    },
    onRemoveItem: e => e,
    onToggleFinished: e => e,
    onViewItem: e => e,
  },
  methods: {
    toggleFinished(event) {
      const key = event.target.dataset.key;
      this.props.onToggleFinished(key);
    },
    removeItem(event) {
      const key = event.target.dataset.key;
      this.props.onRemoveItem(key);
    },
    viewItem(event) {
      const key = event.target.dataset.key;
      this.props.onViewItem(key);
    },
  },
});
