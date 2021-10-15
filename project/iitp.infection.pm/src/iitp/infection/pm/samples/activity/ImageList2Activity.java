package iitp.infection.pm.samples.activity;
import iitp.infection.pm.samples.activity.ImageList1Activity.Dir;
import java.io.File;
import java.lang.ref.WeakReference;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import m.client.android.library.core.common.DataHandler;
import m.client.android.library.core.common.Parameters;
import m.client.android.library.core.model.NetReqOptions;
import m.client.android.library.core.utils.IOUtils;
import m.client.android.library.core.utils.ImageLoader;
import m.client.android.library.core.utils.Logger;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.view.AbstractActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ActivityManager;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.LruCache;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.Toast;


/**
 * ImageListActivity Class
 *
 * @author 성시종(<a mailto="sijong@uracle.co.kr">sijong@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.1 <br>
 *        <DT><B>Date: </B>
 *        <DD>2011.07</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 *
 * Copyright (c) 2001-2011 Uracle Co., Ltd.
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 */
public class ImageList2Activity extends AbstractActivity implements OnClickListener {
	public static final int IMAGE_DETAIL_CODE = 9999;
	private ImageLoader mImageLoader = null;
	ArrayAdapter<String[]> mAdapter = null;
	boolean[] mChecked = null;
	ArrayList<String[]> mImageList = null;

	private int LAYOUT_IMAGELIST = 0;
	private int LAYOUT_ITEM = 0;
	private int ID_GRID = 0;
	private int ID_IMAGE = 0;
	private int ID_CHECK = 0;
	//private int ID_ALL = 0;
	//private int ID_CANCEL = 0;
	private int ID_SET = 0;
	private int ID_BACK = 0;
	private static ViewHolder sCurrHolder = null;
	public boolean imageMode = true;
	public boolean singleMode = true;
	public boolean detailMode = false;
	public boolean zoomMode = false;
	public int numColumn = 3;
	private int maxCount = 0;

	private LruCache<String, Bitmap> mMemoryCache;

	@SuppressWarnings("unchecked")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);

		initID(this);
		setContentView(LAYOUT_IMAGELIST);

		final int memClass = ((ActivityManager) this.getSystemService(Context.ACTIVITY_SERVICE)).getMemoryClass();

		// Use 1/8th of the available memory for this memory cache.
		final int cacheSize = 1024 * 1024 * memClass / 8;

		mMemoryCache = new LruCache<String, Bitmap>(cacheSize);

		/*numColumn = Integer.parseInt((String) mParams.getParam("columns"));
		detailMode = ((String) mParams.getParam("detailMode")).equals("Y")? true : false;
		zoomMode = ((String) mParams.getParam("zoomMode")).equals("Y")? true : false;
		singleMode = ((String) mParams.getParam("singleMode")).equals("Y")? true : false;
		imageMode = ((String) mParams.getParam("imageMode")).equals("Y")? true : false;*/

		numColumn = Integer.parseInt(getIntent().getStringExtra("columns"));
		detailMode = (getIntent().getStringExtra("detailMode")).equals("Y")? true : false;
		zoomMode = (getIntent().getStringExtra("zoomMode")).equals("Y")? true : false;
		singleMode = (getIntent().getStringExtra("singleMode")).equals("Y")? true : false;
		imageMode = (getIntent().getStringExtra("imageMode")).equals("Y")? true : false;
		String _maxcount = getIntent().getStringExtra("maxCount");
		try {
			maxCount = Integer.parseInt(_maxcount);
		} catch (Exception e) {
			// TODO: handle exception
		}



		mImageLoader = new ImageLoader(getApplicationContext());
//		mImageList = (ArrayList<String[]>) mParams.getParam("dir");
		//mImageList = (ArrayList<String[]>) getIntent().getSerializableExtra("dir");
		mImageList = ImageList1Activity.mArrays;

		mChecked = new boolean[mImageList.size()];
		GridView gridView = (GridView) findViewById(ID_GRID);
		gridView.setNumColumns(numColumn);
		setGridOrientation(getResources().getConfiguration());
		gridView.setOnItemClickListener(new OnItemClickListener() {
			public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
				if (detailMode) {
					ViewHolder holder = (ViewHolder) view.getTag();
					sCurrHolder = holder;
					String imagePath = (String) holder.image.getTag();

					Intent intent = new Intent(ImageList2Activity.this, ImageDetailsActivity.class);
					intent.putExtra("imagePath", imagePath);
					intent.putExtra("zoomMode", zoomMode);
					intent.putExtra("imageMode", imageMode);
					startActivityForResult(intent, IMAGE_DETAIL_CODE);
				}
				else {
					ViewHolder holder = (ViewHolder) view.getTag();
					holder.check.performClick();
					if (singleMode) {
						setSelectedImage();
					}
				}
			}
		});

		mAdapter = new ArrayAdapter<String[]>(this, 0, mImageList) {
			@Override
			public View getView(int position, View convertView, ViewGroup parent) {
				ViewHolder holder = null;
				if (convertView == null){
					convertView = getLayoutInflater().inflate(LAYOUT_ITEM, null);
					holder = new ViewHolder();
					holder.image=(ImageView) convertView.findViewById(ID_IMAGE);

					holder.check = (CheckBox) convertView.findViewById(ID_CHECK);
					if (singleMode) {
						holder.check.setVisibility(View.INVISIBLE);
					}

					holder.check.setFocusable(false);
					//holder.check.setActivated(activated);
					holder.check.setOnClickListener(new OnClickListener() {

						@Override
						public void onClick(View v) {

							Logger.e("maxcount : "+maxCount  + " select count : " + getSelectImageCount() );
							int position = (Integer)v.getTag();
							CheckBox check = (CheckBox)v;
							mChecked[position] = check.isChecked();
							if(maxCount > 0 && getSelectImageCount() > maxCount){
								int resID = getResources().getIdentifier("mp_addon_maxpicker", "string", getPackageName());
								String message = String.format(getResources().getString(resID), maxCount);
								Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT).show();
								check.setChecked(false);
								mChecked[position] = false;
								return;
							}
						}
					});

					convertView.setTag(holder);
				}
				else {
					holder= (ViewHolder) convertView.getTag();
				}

				holder.image.setTag(getItem(position)[Dir.PATH]);
				holder.check.setTag(position);
				holder.check.setChecked(mChecked[position]);
				//Bitmap bitmap = ThumbnailUtils.createVideoThumbnail(getItem(position)[Dir.PATH], Thumbnails.MINI_KIND);
				//holder.image.setImageBitmap(bitmap);
				if (holder.image != null) {
					final Bitmap bitmap = getBitmapFromMemCache(getItem(position)[Dir.PATH]);
					if (bitmap != null) {
						if (holder.image != null) {
							if (bitmap != null) {
								holder.image.setImageBitmap(bitmap);
							}
						}
					}
					else {
						try {
							if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.HONEYCOMB) {
								if (imageMode) {
									new ImageDownloaderTask(holder.image).executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, getItem(position)[Dir.PATH]);
								}
								else {
									new ImageDownloaderTask(holder.image).executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, getItem(position)[Dir.ID]);
								}
							}
							else {
								if (imageMode) {
									new ImageDownloaderTask(holder.image).execute(getItem(position)[Dir.PATH]);
								}
								else {
									new ImageDownloaderTask(holder.image).execute(getItem(position)[Dir.ID]);
								}
							}
						}
						catch(Exception e) {
							PLog.d("ImageList2Activity", "ImageDownloaderTask failed.");
						}

					}
					/*if (imageMode) {
						mImageLoader.DisplayImage(getItem(position)[Dir.PATH],
								(Activity)getContext(), holder.image);
					}
					else {
						new ImageDownloaderTask(holder.image).execute(getItem(position)[Dir.PATH]);
					}*/
				}


				/*mImageLoader.DisplayImage(getItem(position)[Dir.PATH],
											(Activity)getContext(),
											holder.image);*/
				return convertView;
			}
		};


		//findViewById(ID_ALL).setOnClickListener(this);
		//findViewById(ID_CANCEL).setOnClickListener(this);
		findViewById(ID_BACK).setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View view) {
				/*JSONArray images = new JSONArray();
				Intent intent = new Intent();
				intent.putExtra("images", images.toString());
				setResult(RESULT_OK, intent);
				finish();*/
				setResult(RESULT_CANCELED);
				finish();
			}
		});
		findViewById(ID_SET).setOnClickListener(new OnClickListener() {

			@Override
			public void onClick(View view) {
				setSelectedImage();
			}
		});
		gridView.setAdapter(mAdapter);
	}

	class ImageDownloaderTask extends AsyncTask<String, Void, Bitmap> {
		private final WeakReference<ImageView> imageViewReference;

		public ImageDownloaderTask(ImageView imageView) {
			imageViewReference = new WeakReference<ImageView>(imageView);
		}

		@Override
		protected Bitmap doInBackground(String... params) {
			if (imageMode) {
				BitmapFactory.Options option = new BitmapFactory.Options();
				option.inJustDecodeBounds = true;
				//option.inSampleSize = 3;
				BitmapFactory.decodeFile(params[0], option);
				option.inSampleSize = calculateInSampleSize(option, 200, 200);
				option.inJustDecodeBounds = false;
				Bitmap bitmap = mImageLoader.GetRotatedBitmap(BitmapFactory.decodeFile(params[0], option), mImageLoader.GetExifOrientation(params[0]));
				//Bitmap bitmap = BitmapFactory.decodeFile(params[0], option);
				if(params[0] != null && bitmap != null){
					addBitmapToMemoryCache(String.valueOf(params[0]), bitmap);
				}
				return bitmap;
			}
			else {
				ContentResolver crThumb = ImageList2Activity.this.getContentResolver();
				BitmapFactory.Options opt=new BitmapFactory.Options();
				opt.inSampleSize = 1;
				int id = Integer.parseInt(params[0]);
				Bitmap bitmap = MediaStore.Video.Thumbnails.getThumbnail(crThumb, id, MediaStore.Video.Thumbnails.MICRO_KIND, opt);

				return bitmap;

				//return ThumbnailUtils.createVideoThumbnail(params[0], Thumbnails.MINI_KIND);
			}
		}

		@Override
		protected void onPostExecute(Bitmap bitmap) {
			if (isCancelled()) {
				bitmap.recycle();
				bitmap = null;
			}

			if (imageViewReference != null) {
				ImageView imageView = imageViewReference.get();
				if (imageView != null) {
					if (bitmap != null) {
						imageView.setImageBitmap(bitmap);
					}
				}
			}
		}
	}


	protected int getSelectImageCount(){
		int count = 0;
		for(int i = 0; i< mChecked.length; i++){
			if(mChecked[i]){
				count ++;
			}
		}
		return count;
	}
	public static int calculateInSampleSize(
			BitmapFactory.Options options, int reqWidth, int reqHeight) {
		// Raw height and width of image
		final int height = options.outHeight;
		final int width = options.outWidth;
		int inSampleSize = 1;

		if (height > reqHeight || width > reqWidth) {

			final int halfHeight = height / 2;
			final int halfWidth = width / 2;

			// Calculate the largest inSampleSize value that is a power of 2 and keeps both
			// height and width larger than the requested height and width.
			while ((halfHeight / inSampleSize) > reqHeight
					&& (halfWidth / inSampleSize) > reqWidth) {
				inSampleSize *= 2;
			}
		}
		inSampleSize += 2;
/*	    System.out.println("calculateInSampleSize: width: " + width);
	    System.out.println("calculateInSampleSize: height: " + height);
	    System.out.println("calculateInSampleSize: inSampleSize: " + inSampleSize);*/
		return inSampleSize;

	}

	public void addBitmapToMemoryCache(String key, Bitmap bitmap) {
		if (getBitmapFromMemCache(key) == null) {
			mMemoryCache.put(key, bitmap);
		}
	}

	public Bitmap getBitmapFromMemCache(String key) {
		return mMemoryCache.get(key);
	}

	/**
	 * ID 초기화
	 * @param context
	 */
	private void initID(Context context) {
		Resources res = context.getResources();

		LAYOUT_IMAGELIST = res.getIdentifier("activity_imagelist2", "layout", context.getPackageName());
		LAYOUT_ITEM = res.getIdentifier("gridview_item2", "layout", context.getPackageName());
		ID_GRID = res.getIdentifier("grid", "id", context.getPackageName());
		ID_IMAGE = res.getIdentifier("image", "id", context.getPackageName());
		ID_CHECK = res.getIdentifier("check", "id", context.getPackageName());
		//ID_ALL = res.getIdentifier("all", "id", context.getPackageName());
		//ID_CANCEL = res.getIdentifier("cancel", "id", context.getPackageName());
		ID_SET = res.getIdentifier("okBtn", "id", context.getPackageName());
		ID_BACK = res.getIdentifier("cancelBtn", "id", context.getPackageName());
	}

	@Override
	public void onClick(View v) {
		/*boolean isSelect = false;

		int id = v.getId();
		if (id == ID_ALL) {
			isSelect = true;
		} else if(id == ID_CANCEL){
			isSelect = false;
		}

		for (int i = 0;i< mChecked.length; i++) {
			mChecked[i] = isSelect;
		}
		mAdapter.notifyDataSetChanged();*/
	}

	/*@Override
	public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
		ViewHolder holder = (ViewHolder)view.getTag();
		holder.check.performClick();
	}*/

	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		super.onConfigurationChanged(newConfig);
		setGridOrientation(newConfig);
	}

	/**
	 * 화면전환이 일어날경우 호출하여 화면에 변화를 준다.
	 * @param configuration
	 */
	private void setGridOrientation(Configuration configuration) {
//		GridView grid = (GridView )findViewById(ID_GRID);

		if (configuration.orientation == Configuration.ORIENTATION_LANDSCAPE) {
//			grid.setNumColumns(4);
		} else if (configuration.orientation == Configuration.ORIENTATION_PORTRAIT) {
//			grid.setNumColumns(3);
		}
	}

	@Override
	public void handlingError(String callerServerName, String trCode, String errCode, String errMessage, NetReqOptions netReqOptions) { }

	@Override
	public void requestData(String stTrCode, String otherInfos,
	                        DataHandler dhSendData, NetReqOptions netReqOptions) { }

	@Override
	public void responseData(int nDataType, String stTrCode, String otherInfos, String dhRecvData, NetReqOptions netReqOptions) { }


	/**
	 * ViewHolder Class
	 *
	 * @author 성시종(<a mailto="sijong@uracle.co.kr">sijong@uracle.co.kr</a>)
	 * @version v 1.0.0
	 * @since Android 2.1 <br>
	 *        <DT><B>Date: </B>
	 *        <DD>2011.07</DD>
	 *        <DT><B>Company: </B>
	 *        <DD>Uracle Co., Ltd.</DD>
	 *
	 * ListView에서 사용하기 위한 Holder class
	 *
	 * Copyright (c) 2001-2011 Uracle Co., Ltd.
	 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
	 */
	class ViewHolder {
		ImageView image = null;
		CheckBox check;
	}


	@Override
	public void onRestoreActivity(Parameters params) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onFinishedCaptureView() {
		// TODO Auto-generated method stub

	}

	@Override
	public void onApplicationWillTerminate() {
		// TODO Auto-generated method stub

	}

	@Override
	public void onBackPressed() {
		setSelectedImage();
	}

	private void setSelectedImage() {
		boolean[] _checked = mChecked;
		ArrayList<String[]> _imageArrayList = mImageList;
		//JSONObject value = new JSONObject();
		JSONArray images = new JSONArray();
		int length = _checked.length;
		try {
			for (int i = 0; i< length; i++) {
				if (_checked[i]) {
					JSONObject item = new JSONObject();
					String source = _imageArrayList.get(i)[Dir.PATH];//파일 경로
					String name = _imageArrayList.get(i)[Dir.NAME];//파일 이름
					String strOrientation  = _imageArrayList.get(i)[Dir.ORIENTATION];
					String strDuration  = _imageArrayList.get(i)[Dir.DURATION];

					int orientation = 0;
					long duration = 0;
					try {
						orientation = Integer.valueOf(strOrientation);
						duration = Long.valueOf(strDuration);
					} catch (NumberFormatException e){ }

					File file = new File(source);
					Date lastModifyDate = new Date(file.lastModified());
					SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
					SimpleDateFormat durationFormat = new SimpleDateFormat("HHmmssSSS");
					String path = IOUtils.getRelativePathFromFullpath(source);
					String alias = IOUtils.getSchemeFromFullpath(source);
					item.put("source", source);
					item.put("webpath", path);
					item.put("path", path);
					item.put("alias", alias);
					item.put("name",name);
					item.put("size",file.length()+"");//파일 사이즈
					if (imageMode) {
						item.put("created",format.format(lastModifyDate));
						item.put("updated",format.format(lastModifyDate));//마지막 수정날짜
						item.put("orientation", Integer.valueOf(orientation));//파일 사이즈
					}
					else {
						item.put("endDate",format.format(lastModifyDate));
						item.put("startDate",format.format(lastModifyDate));
						item.put("duration", durationFormat.format(duration-32400000));
					}
					images.put(item);
				}
			}
			//value.put("images", images);
		} catch (JSONException e) {
			PLog.printTrace(e);
		}

		Intent intent = new Intent();
		intent.putExtra("images", images.toString());
		setResult(RESULT_OK, intent);
		finish();
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);

		// 이미지를 선택 하고 넘어 왓을때
		if (resultCode == RESULT_OK &&
				requestCode == IMAGE_DETAIL_CODE) {
			if (sCurrHolder != null) {
				sCurrHolder.check.performClick();
			}

			if (singleMode) {
				setSelectedImage();
			}
		}
	}
}
