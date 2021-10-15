package iitp.infection.pm.samples.utils;

import java.util.List;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;

public abstract class ListAdapter<T> extends ArrayAdapter<T> {
	private Context 	mContext;
	private int 		mResourceId = 0;
	
	public ListAdapter(Context context, int resourceId, List<T> list) {
		super(context, resourceId, list);
		mContext = context;
		mResourceId = resourceId;
	}

	public ListAdapter(Context context, int resourceId, T[] list) {
		super(context, resourceId, list);
		mContext = context;
		mResourceId = resourceId;
	}

	@Override
	public abstract View getView(int position, View convertView, ViewGroup parent);

	@Override
	public T getItem(int position) {
		return super.getItem(position);
	}	
	
	public int getResourceId(){
		return mResourceId;
	}
	
	public Context getContext(){
		return mContext;
	}
	
	public void setResourceId(int resourceId) {
		mResourceId = resourceId;
	}
}
