package iitp.infection.pm.samples.activity;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.ThumbnailUtils;
import android.os.Bundle;
import android.provider.MediaStore.Video.Thumbnails;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.ImageView;

import iitp.infection.pm.R;

public class ImageDetailsActivity extends Activity {
	private int ID_OK = 0;
	private int ID_CANCEL = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.image_details_activity);
        initID(this);
        findViewById(ID_CANCEL).setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View view) {
				setResult(RESULT_CANCELED);
				finish();
			}
		});
		findViewById(ID_OK).setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View view) {
				setResult(RESULT_OK);
				finish();
			}
		});
		
		boolean imageMode = getIntent().getBooleanExtra("imageMode", true);
		boolean zoomMode = getIntent().getBooleanExtra("zoomMode", false);
        String imagePath = getIntent().getStringExtra("imagePath");
        Bitmap bitmap = null;
        if (imageMode) {
        	BitmapFactory.Options option = new BitmapFactory.Options();
			option.inSampleSize = 2;
			bitmap = BitmapFactory.decodeFile(imagePath, option);
        }
        else {
        	bitmap = ThumbnailUtils.createVideoThumbnail(imagePath, Thumbnails.FULL_SCREEN_KIND);
        }
		
		
		if (zoomMode) {
			ImageView zoomImageView = (ImageView) findViewById(R.id.zoom_image);
			zoomImageView.setImageBitmap(bitmap);
			ImageView imageView = (ImageView) findViewById(R.id.image);
			imageView.setVisibility(View.GONE);
			zoomImageView.setVisibility(View.VISIBLE);
		}
		else {
			ImageView imageView = (ImageView) findViewById(R.id.image);
			imageView.setImageBitmap(bitmap);
			ImageView zoomImageView = (ImageView) findViewById(R.id.zoom_image);
			zoomImageView.setVisibility(View.GONE);
			imageView.setVisibility(View.VISIBLE);
		}
    }
    
    private void initID(Context context) {
		Resources res = context.getResources();
		
		ID_OK = res.getIdentifier("okBtn", "id", context.getPackageName());
		ID_CANCEL = res.getIdentifier("cancelBtn", "id", context.getPackageName());
	}
}
